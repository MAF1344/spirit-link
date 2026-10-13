-- Fase 2: Character Classes & Progression System
-- Migration untuk menambahkan character class system

-- =====================================================
-- 1. ADD CHARACTER CLASS COLUMN TO PLAYERS
-- =====================================================

ALTER TABLE players 
ADD COLUMN IF NOT EXISTS character_class VARCHAR(50) CHECK (
  character_class IN ('quran_protector', 'dai', 'scholar', 'mumin')
);

ALTER TABLE players
ADD COLUMN IF NOT EXISTS class_selected_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_players_class ON players(character_class);

-- =====================================================
-- 2. CALCULATE LEVEL FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_level(total_exp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER := 1;
BEGIN
  -- Level 1-10: 100 EXP per level (0-999 EXP)
  IF total_exp < 1000 THEN
    RETURN 1 + (total_exp / 100);
  END IF;
  
  -- Level 11-25: 250 EXP per level (1000-4749 EXP)
  IF total_exp < 4750 THEN
    RETURN 10 + ((total_exp - 1000) / 250);
  END IF;
  
  -- Level 26-50: 500 EXP per level (4750-17249 EXP)
  IF total_exp < 17250 THEN
    RETURN 25 + ((total_exp - 4750) / 500);
  END IF;
  
  -- Level 51-75: 1000 EXP per level (17250-42249 EXP)
  IF total_exp < 42250 THEN
    RETURN 50 + ((total_exp - 17250) / 1000);
  END IF;
  
  -- Level 76-100: 2000 EXP per level (42250-92249 EXP)
  IF total_exp < 92250 THEN
    RETURN 75 + ((total_exp - 42250) / 2000);
  END IF;
  
  -- Max level 100
  RETURN 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 3. GET RANK FROM LEVEL FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION get_rank_from_level(player_level INTEGER)
RETURNS VARCHAR(20) AS $$
BEGIN
  IF player_level >= 50 THEN
    RETURN 'Exalted';
  ELSIF player_level >= 40 THEN
    RETURN 'Warden';
  ELSIF player_level >= 25 THEN
    RETURN 'Guardian';
  ELSIF player_level >= 10 THEN
    RETURN 'Acolyte';
  ELSE
    RETURN 'Seeker';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 4. UPDATED APPROVE MISSION FUNCTION WITH CLASS MULTIPLIER
-- =====================================================

CREATE OR REPLACE FUNCTION approve_mission_v2(
  p_submission_id UUID,
  p_validator_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  new_exp INTEGER,
  new_level INTEGER,
  old_level INTEGER,
  level_up BOOLEAN,
  exp_awarded INTEGER,
  multiplier NUMERIC,
  message TEXT
) AS $$
DECLARE
  v_submission RECORD;
  v_player RECORD;
  v_base_exp INTEGER;
  v_final_exp INTEGER;
  v_multiplier NUMERIC := 1.0;
  v_old_level INTEGER;
  v_new_level INTEGER;
  v_new_total_exp INTEGER;
BEGIN
  -- Get submission and quest details
  SELECT 
    ms.*,
    qm.exp_reward,
    qm.mission_type
  INTO v_submission
  FROM mission_submissions ms
  JOIN dungeon_quests dq ON ms.dungeon_quest_id = dq.id
  JOIN quest_master qm ON dq.quest_master_id = qm.id
  WHERE ms.id = p_submission_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, 0, FALSE, 0, 0::NUMERIC, 'Submission tidak ditemukan';
    RETURN;
  END IF;
  
  IF v_submission.status != 'pending' THEN
    RETURN QUERY SELECT FALSE, 0, 0, 0, FALSE, 0, 0::NUMERIC, 'Submission sudah divalidasi';
    RETURN;
  END IF;
  
  -- Get player data
  SELECT * INTO v_player
  FROM players
  WHERE id = v_submission.player_id;
  
  v_base_exp := v_submission.exp_reward;
  v_old_level := v_player.level;
  
  -- Calculate multiplier based on class and mission type
  IF v_player.character_class = 'quran_protector' AND v_submission.mission_type = 'quran_reading' THEN
    v_multiplier := 1.2;
  ELSIF v_player.character_class = 'dai' AND v_submission.mission_type = 'community_service' THEN
    v_multiplier := 1.2;
  ELSIF v_player.character_class = 'scholar' AND v_submission.mission_type = 'learning_quiz' THEN
    v_multiplier := 1.2;
  ELSIF v_player.character_class = 'mumin' THEN
    v_multiplier := 1.05;
  END IF;
  
  v_final_exp := FLOOR(v_base_exp * v_multiplier);
  v_new_total_exp := v_player.total_exp + v_final_exp;
  
  -- Update submission
  UPDATE mission_submissions
  SET 
    status = 'approved',
    validated_by = p_validator_id,
    validated_at = NOW(),
    exp_awarded = v_final_exp
  WHERE id = p_submission_id;
  
  -- Calculate new level
  v_new_level := calculate_level(v_new_total_exp);
  
  -- Update player EXP and level
  UPDATE players
  SET 
    total_exp = v_new_total_exp,
    level = v_new_level,
    updated_at = NOW()
  WHERE id = v_submission.player_id;
  
  RETURN QUERY SELECT 
    TRUE, 
    v_new_total_exp,
    v_new_level,
    v_old_level,
    (v_new_level > v_old_level),
    v_final_exp,
    v_multiplier,
    'Mission approved successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. HELPER FUNCTION: GET EXP FOR NEXT LEVEL
-- =====================================================

CREATE OR REPLACE FUNCTION get_exp_for_level(target_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level 1-10: 100 EXP per level
  IF target_level <= 10 THEN
    RETURN (target_level - 1) * 100;
  END IF;
  
  -- Level 11-25: 250 EXP per level
  IF target_level <= 25 THEN
    RETURN 1000 + ((target_level - 10) * 250);
  END IF;
  
  -- Level 26-50: 500 EXP per level
  IF target_level <= 50 THEN
    RETURN 4750 + ((target_level - 25) * 500);
  END IF;
  
  -- Level 51-75: 1000 EXP per level
  IF target_level <= 75 THEN
    RETURN 17250 + ((target_level - 50) * 1000);
  END IF;
  
  -- Level 76-100: 2000 EXP per level
  IF target_level <= 100 THEN
    RETURN 42250 + ((target_level - 75) * 2000);
  END IF;
  
  RETURN 92250; -- Max EXP for level 100
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON COLUMN players.character_class IS 'Player character class: quran_protector, dai, scholar, or mumin';
COMMENT ON COLUMN players.class_selected_at IS 'Timestamp when player selected their class';
COMMENT ON FUNCTION calculate_level IS 'Calculate player level from total EXP';
COMMENT ON FUNCTION get_rank_from_level IS 'Get rank name (Seeker, Acolyte, etc) from level';
COMMENT ON FUNCTION approve_mission_v2 IS 'Approve mission with class-based EXP multiplier';
COMMENT ON FUNCTION get_exp_for_level IS 'Get minimum EXP required to reach a specific level';
