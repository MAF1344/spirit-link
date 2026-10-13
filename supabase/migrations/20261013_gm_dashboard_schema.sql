-- Fase 1E: GM Dashboard Schema
-- Tables untuk Quest System, GM Management, dan Mission Validation

-- =====================================================
-- 1. ROLES & PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('player', 'mosque_admin', 'quest_creator', 'validator', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_roles_role ON user_roles(role);

-- =====================================================
-- 2. QUEST MASTER LIST (Single Source of Truth)
-- =====================================================

CREATE TABLE IF NOT EXISTS quest_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  mission_type VARCHAR(50) NOT NULL CHECK (mission_type IN (
    'daily_prayer', 'quran_reading', 'community_service', 
    'learning_quiz', 'group_mission', 'special_event', 
    'photo_proof', 'time_limited'
  )),
  exp_reward INTEGER NOT NULL DEFAULT 50,
  parameter_category VARCHAR(50) NOT NULL CHECK (parameter_category IN (
    'mandatory_worship', 'sunnah_devotion', 'quranic_literacy', 
    'seekers_insight', 'dawah_outreach'
  )),
  validation_method VARCHAR(50) NOT NULL CHECK (validation_method IN (
    'qr_tapin', 'photo_video', 'gm_manual', 'auto_quiz', 'honor_system'
  )),
  requires_proof BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quest_master_type ON quest_master(mission_type);
CREATE INDEX idx_quest_master_active ON quest_master(is_active);

-- =====================================================
-- 3. DUNGEON QUESTS (GM Scheduled Missions)
-- =====================================================

CREATE TABLE IF NOT EXISTS dungeon_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  quest_master_id UUID NOT NULL REFERENCES quest_master(id) ON DELETE CASCADE,
  prayer_type VARCHAR(20) CHECK (prayer_type IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  schedule_type VARCHAR(20) NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'once')),
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_dungeon_quests_dungeon ON dungeon_quests(dungeon_id);
CREATE INDEX idx_dungeon_quests_master ON dungeon_quests(quest_master_id);
CREATE INDEX idx_dungeon_quests_active ON dungeon_quests(is_active);
CREATE INDEX idx_dungeon_quests_dates ON dungeon_quests(start_date, end_date);

-- =====================================================
-- 4. MISSION SUBMISSIONS (Player Evidence)
-- =====================================================

CREATE TABLE IF NOT EXISTS mission_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  dungeon_quest_id UUID NOT NULL REFERENCES dungeon_quests(id) ON DELETE CASCADE,
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  submission_type VARCHAR(20) NOT NULL CHECK (submission_type IN ('photo', 'video', 'text', 'auto')),
  proof_url TEXT,
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  exp_awarded INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  CONSTRAINT no_duplicate_submission UNIQUE(player_id, dungeon_quest_id, submitted_date)
);

CREATE INDEX idx_submissions_player ON mission_submissions(player_id);
CREATE INDEX idx_submissions_dungeon ON mission_submissions(dungeon_id);
CREATE INDEX idx_submissions_status ON mission_submissions(status);
CREATE INDEX idx_submissions_date ON mission_submissions(submitted_at);

-- =====================================================
-- 5. GM ASSIGNMENTS (Dungeon Admin Mapping)
-- =====================================================

CREATE TABLE IF NOT EXISTS dungeon_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_admin_dungeon UNIQUE(user_id, dungeon_id)
);

CREATE INDEX idx_dungeon_admins_user ON dungeon_admins(user_id);
CREATE INDEX idx_dungeon_admins_dungeon ON dungeon_admins(dungeon_id);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function untuk check apakah user adalah GM dari dungeon tertentu
CREATE OR REPLACE FUNCTION is_dungeon_admin(check_user_id UUID, check_dungeon_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM dungeon_admins 
    WHERE user_id = check_user_id AND dungeon_id = check_dungeon_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk check apakah user adalah super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = check_user_id AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk approve mission dan award EXP
CREATE OR REPLACE FUNCTION approve_mission(
  p_submission_id UUID,
  p_validator_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  new_exp INTEGER,
  new_level INTEGER,
  message TEXT
) AS $$
DECLARE
  v_submission RECORD;
  v_quest RECORD;
  v_exp_result RECORD;
BEGIN
  -- Get submission details
  SELECT 
    ms.*,
    qm.exp_reward
  INTO v_submission
  FROM mission_submissions ms
  JOIN dungeon_quests dq ON ms.dungeon_quest_id = dq.id
  JOIN quest_master qm ON dq.quest_master_id = qm.id
  WHERE ms.id = p_submission_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'Submission tidak ditemukan';
    RETURN;
  END IF;
  
  IF v_submission.status != 'pending' THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'Submission sudah divalidasi';
    RETURN;
  END IF;
  
  -- Update submission status
  UPDATE mission_submissions
  SET 
    status = 'approved',
    validated_by = p_validator_id,
    validated_at = NOW(),
    exp_awarded = v_submission.exp_reward
  WHERE id = p_submission_id;
  
  -- Award EXP
  SELECT * INTO v_exp_result
  FROM award_exp(v_submission.player_id, v_submission.exp_reward);
  
  RETURN QUERY SELECT 
    TRUE, 
    v_exp_result.new_exp, 
    v_exp_result.new_level,
    'Mission approved successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk reject mission
CREATE OR REPLACE FUNCTION reject_mission(
  p_submission_id UUID,
  p_validator_id UUID,
  p_reason TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_status VARCHAR(20);
BEGIN
  SELECT status INTO v_status
  FROM mission_submissions
  WHERE id = p_submission_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Submission tidak ditemukan';
    RETURN;
  END IF;
  
  IF v_status != 'pending' THEN
    RETURN QUERY SELECT FALSE, 'Submission sudah divalidasi';
    RETURN;
  END IF;
  
  UPDATE mission_submissions
  SET 
    status = 'rejected',
    validated_by = p_validator_id,
    validated_at = NOW(),
    rejection_reason = p_reason
  WHERE id = p_submission_id;
  
  RETURN QUERY SELECT TRUE, 'Mission rejected';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeon_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeon_admins ENABLE ROW LEVEL SECURITY;

-- user_roles policies
CREATE POLICY "Public can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admin can manage all roles" ON user_roles
  FOR ALL USING (is_super_admin(auth.uid()));

-- quest_master policies
CREATE POLICY "Anyone can read active quests" ON quest_master
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Quest creators can manage quests" ON quest_master
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('quest_creator', 'super_admin')
    )
  );

-- dungeon_quests policies
CREATE POLICY "Anyone can read active dungeon quests" ON dungeon_quests
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "GM can manage own dungeon quests" ON dungeon_quests
  FOR ALL USING (
    is_dungeon_admin(auth.uid(), dungeon_id) OR is_super_admin(auth.uid())
  );

-- mission_submissions policies
CREATE POLICY "Players can create own submissions" ON mission_submissions
  FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can read own submissions" ON mission_submissions
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "GM can read submissions for own dungeon" ON mission_submissions
  FOR SELECT USING (
    is_dungeon_admin(auth.uid(), dungeon_id) OR is_super_admin(auth.uid())
  );

CREATE POLICY "GM can validate submissions for own dungeon" ON mission_submissions
  FOR UPDATE USING (
    is_dungeon_admin(auth.uid(), dungeon_id) OR is_super_admin(auth.uid())
  );

-- dungeon_admins policies
CREATE POLICY "Admins can read own assignments" ON dungeon_admins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admin can manage all assignments" ON dungeon_admins
  FOR ALL USING (is_super_admin(auth.uid()));

-- =====================================================
-- 8. SEED DATA: Default Quest Master Templates
-- =====================================================

INSERT INTO quest_master (title, description, mission_type, exp_reward, parameter_category, validation_method, requires_proof) VALUES
  ('Sholat Subuh Berjamaah', 'Hadir sholat Subuh berjamaah di masjid', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin', FALSE),
  ('Sholat Dzuhur Berjamaah', 'Hadir sholat Dzuhur berjamaah di masjid', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin', FALSE),
  ('Sholat Ashar Berjamaah', 'Hadir sholat Ashar berjamaah di masjid', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin', FALSE),
  ('Sholat Maghrib Berjamaah', 'Hadir sholat Maghrib berjamaah di masjid', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin', FALSE),
  ('Sholat Isya Berjamaah', 'Hadir sholat Isya berjamaah di masjid', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin', FALSE),
  ('Baca Al-Quran 1 Halaman', 'Membaca Al-Quran minimal 1 halaman', 'quran_reading', 30, 'quranic_literacy', 'photo_video', TRUE),
  ('Hafalan Surat Pendek', 'Menghafal surat pendek pilihan', 'quran_reading', 100, 'quranic_literacy', 'gm_manual', TRUE),
  ('Kajian Mingguan', 'Menghadiri kajian rutin mingguan', 'learning_quiz', 300, 'seekers_insight', 'qr_tapin', FALSE),
  ('Bersih-Bersih Masjid', 'Bergotong royong membersihkan masjid', 'community_service', 80, 'dawah_outreach', 'photo_video', TRUE),
  ('Sholat Dhuha', 'Melaksanakan sholat Dhuha', 'daily_prayer', 40, 'sunnah_devotion', 'honor_system', FALSE)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE quest_master IS 'Master quest templates - only editable by Quest Creators and Super Admin';
COMMENT ON TABLE dungeon_quests IS 'GM-scheduled quests mapped from master templates';
COMMENT ON TABLE mission_submissions IS 'Player mission submissions requiring validation';
