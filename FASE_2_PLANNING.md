# FASE 2: CHARACTER CLASSES & PROGRESSION SYSTEM

**Spirit Link Project**  
**Version:** 1.0  
**Date:** 13 Oktober 2026  
**Phase:** Fase 2 - Character Classes & Progression

---

## 📋 OVERVIEW

Fase 2 mengimplementasikan sistem character classes dan progression yang merupakan core mechanic dari gamification Spirit Link. Player dapat memilih class specialization dan mendapatkan bonus EXP sesuai dengan class mereka.

### Objectives
1. Player dapat memilih character class (one-time selection)
2. Implementasi 4 character classes dengan unique bonuses
3. System progression dengan level & EXP calculation
4. Class-specific EXP multipliers
5. Rank system berdasarkan level
6. Character profile display

---

## 🎯 FEATURES

### 1. Character Class Selection
**Trigger:** First-time login atau player tanpa class

**4 Available Classes:**

#### 1.1 The Quran Protector
- **Specialty:** Quranic Literacy
- **Bonus:** 1.2x EXP multiplier untuk quran_reading missions
- **Description:** Specialist in Quranic Literacy. Gains bonus power for memorization streaks.
- **Icon/Color:** Green with Quran symbol
- **Parameter Focus:** Quranic Literacy

#### 1.2 The Da'i
- **Specialty:** Dawah Outreach
- **Bonus:** 1.2x EXP multiplier untuk community_service missions
- **Description:** Vanguard of Dawah Outreach. Excels in mosque committee and digital activism.
- **Icon/Color:** Blue with megaphone/community symbol
- **Parameter Focus:** Dawah Outreach

#### 1.3 The Scholar
- **Specialty:** Seeker's Insight
- **Bonus:** 1.2x EXP multiplier untuk learning_quiz missions
- **Description:** Seeker of knowledge. Gains intellect-based buffs for attending study circles.
- **Icon/Color:** Purple with book/scroll symbol
- **Parameter Focus:** Seeker's Insight (Kajian)

#### 1.4 The Mu'min
- **Specialty:** Balanced (all types)
- **Bonus:** Flat +5% EXP across ALL mission types (1.05x multiplier)
- **Description:** Balanced class. No single specialization but steady growth in all areas.
- **Icon/Color:** Gold with balance/harmony symbol
- **Parameter Focus:** All parameters equally

**Selection Flow:**
1. Modal/page dengan carousel/grid 4 classes
2. Click class untuk see details
3. Confirmation: "Pilihan class permanent. Yakin pilih [ClassName]?"
4. Save to database
5. Cannot change (unless Super Admin reset)

---

### 2. Progression System

#### 2.1 Level Calculation
**Formula:** Exponential growth
```
Level 1-10:   100 EXP per level (total 1,000 EXP to reach level 10)
Level 11-25:  250 EXP per level
Level 26-50:  500 EXP per level
Level 51-75:  1,000 EXP per level
Level 76-100: 2,000 EXP per level
```

**Max Level:** 100 per dungeon

**Current Implementation:**
- Players table already has `level` and `total_exp` columns
- Need to add `character_class` column
- Need to add level-up calculation function

#### 2.2 EXP Award with Class Multiplier
**Current Flow (Fase 1E):**
```
1. GM approves mission
2. approve_mission() function awards base EXP
3. Player total_exp increases
```

**Updated Flow (Fase 2):**
```
1. GM approves mission
2. Check player's character_class
3. Check quest's mission_type
4. Apply class multiplier if match:
   - Quran Protector + quran_reading = 1.2x
   - Da'i + community_service = 1.2x
   - Scholar + learning_quiz = 1.2x
   - Mu'min + any = 1.05x
5. Award EXP with multiplier
6. Calculate new level
7. Check if level up
8. Update player level and total_exp
```

#### 2.3 Level Up Calculation
```sql
CREATE OR REPLACE FUNCTION calculate_level(total_exp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER := 1;
  exp_required INTEGER := 0;
BEGIN
  -- Level 1-10: 100 EXP per level
  IF total_exp < 1000 THEN
    RETURN 1 + (total_exp / 100);
  END IF;
  
  current_level := 10;
  exp_required := 1000;
  
  -- Level 11-25: 250 EXP per level
  IF total_exp < 4750 THEN -- 1000 + (15 * 250)
    RETURN 10 + ((total_exp - 1000) / 250);
  END IF;
  
  current_level := 25;
  exp_required := 4750;
  
  -- Level 26-50: 500 EXP per level
  IF total_exp < 17250 THEN -- 4750 + (25 * 500)
    RETURN 25 + ((total_exp - 4750) / 500);
  END IF;
  
  current_level := 50;
  exp_required := 17250;
  
  -- Level 51-75: 1000 EXP per level
  IF total_exp < 42250 THEN -- 17250 + (25 * 1000)
    RETURN 50 + ((total_exp - 17250) / 1000);
  END IF;
  
  current_level := 75;
  exp_required := 42250;
  
  -- Level 76-100: 2000 EXP per level
  IF total_exp < 92250 THEN -- 42250 + (25 * 2000)
    RETURN 75 + ((total_exp - 42250) / 2000);
  END IF;
  
  -- Max level 100
  RETURN 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

### 3. Rank System

**Ranks based on level:**

| Rank | Level Range | Badge Color | Description |
|------|-------------|-------------|-------------|
| Seeker | 1-9 | Gray | Starting rank. A hero searching for light amidst The Void. |
| Acolyte | 10-24 | Silver | Committed to routine sanctuary missions. |
| Guardian | 25-39 | Blue | True protectors of the Sanctuary. |
| Warden | 40-49 | Purple | Leaders of Dungeon Raids. Can act as raid leaders. |
| Exalted | 50+ | Gold | Legends whose spiritual activity holds back the Doom Meter. |

**Display:**
- Rank badge displayed on player profile
- Rank name with icon
- Glowing effect for higher ranks

---

### 4. Character Profile Page

**Location:** `/profile` or `/character`

**Display:**
- Hero name
- Character class with icon
- Current level
- Current rank with badge
- Total EXP
- EXP progress bar to next level
- Stats breakdown:
  - Mandatory Worship missions completed
  - Sunnah Devotion missions completed
  - Quranic Literacy missions completed
  - Seeker's Insight missions completed
  - Dawah Outreach missions completed
- QR code for check-in
- Class bonus information

---

## 🗄️ DATABASE CHANGES

### 1. Add Character Class Column to Players Table

```sql
-- Add character_class column
ALTER TABLE players 
ADD COLUMN character_class VARCHAR(50) CHECK (
  character_class IN ('quran_protector', 'dai', 'scholar', 'mumin', NULL)
);

-- Add index for performance
CREATE INDEX idx_players_class ON players(character_class);

-- Add timestamp for when class was selected
ALTER TABLE players
ADD COLUMN class_selected_at TIMESTAMPTZ;
```

### 2. Update approve_mission Function

**Current function** (from Fase 1E) awards flat EXP.

**Updated function** should:
1. Get player's character_class
2. Get quest's mission_type
3. Calculate multiplier based on class-mission match
4. Award EXP with multiplier
5. Calculate new level using calculate_level()
6. Return level_up boolean if level changed

```sql
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
  
  -- Calculate multiplier based on class
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
  
  -- Update submission
  UPDATE mission_submissions
  SET 
    status = 'approved',
    validated_by = p_validator_id,
    validated_at = NOW(),
    exp_awarded = v_final_exp
  WHERE id = p_submission_id;
  
  -- Update player EXP and level
  UPDATE players
  SET 
    total_exp = total_exp + v_final_exp,
    level = calculate_level(total_exp + v_final_exp),
    updated_at = NOW()
  WHERE id = v_submission.player_id
  RETURNING total_exp, level INTO v_player;
  
  v_new_level := v_player.level;
  
  RETURN QUERY SELECT 
    TRUE, 
    v_player.total_exp,
    v_new_level,
    v_old_level,
    (v_new_level > v_old_level),
    v_final_exp,
    v_multiplier,
    'Mission approved successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎨 UI/UX DESIGN

### Class Selection Screen

**Layout:**
- Full-screen modal or dedicated page
- Title: "Choose Your Path"
- Subtitle: "Select your specialization. This choice is permanent."
- 4 class cards in grid (2x2 on mobile, 4x1 on desktop)

**Class Card Design:**
```
┌─────────────────────────┐
│   [CLASS ICON]          │
│                         │
│   The Quran Protector   │
│   ─────────────────     │
│   Quranic Literacy      │
│   Specialist            │
│                         │
│   Bonus: 1.2x EXP       │
│   on Quran missions     │
│                         │
│   [SELECT CLASS]        │
└─────────────────────────┘
```

**States:**
- Hover: Glow effect, slight scale
- Selected: Highlighted border (cyan)
- Confirmed: Show confirmation dialog

### Profile/Character Page

**Layout:**
```
┌─────────────────────────────────┐
│  Hero Name                      │
│  ═══════════════                │
│                                 │
│  [Class Icon] The Scholar       │
│  Level 15 • Acolyte            │
│  ─────────────────              │
│                                 │
│  ▓▓▓▓▓▓▓▓░░░░  3,250 / 4,000   │
│  75% to Level 16                │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Total EXP: 3,250          │ │
│  │ Missions Completed: 42    │ │
│  │ Class Bonus: +20% on      │ │
│  │ Learning Missions         │ │
│  └───────────────────────────┘ │
│                                 │
│  Mission Stats:                 │
│  • Mandatory Worship: 15       │
│  • Sunnah Devotion: 8          │
│  • Quranic Literacy: 12        │
│  • Seeker's Insight: 5 ⭐      │
│  • Dawah Outreach: 2           │
│                                 │
│  [QR Code]                     │
└─────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Database Migration (30 minutes)
- [ ] Create migration file for character_class column
- [ ] Create calculate_level() function
- [ ] Update approve_mission() to approve_mission_v2()
- [ ] Test migration on local database

### Phase 2: Class Selection Component (2 hours)
- [ ] Create `ClassSelectionModal.jsx`
- [ ] Create `ClassCard.jsx` component
- [ ] Implement selection logic
- [ ] Add confirmation dialog
- [ ] Save class to database
- [ ] Show modal on first login (no class selected)

### Phase 3: Update Mission Approval (1 hour)
- [ ] Update GM Dashboard to use approve_mission_v2()
- [ ] Display multiplier in approval UI
- [ ] Show "Level Up!" message if applicable

### Phase 4: Character Profile Page (2 hours)
- [ ] Create `CharacterPage.jsx`
- [ ] Display character info with class
- [ ] Show level progress bar
- [ ] Display rank badge
- [ ] Show mission stats breakdown
- [ ] Add navigation link from home

### Phase 5: Update Existing Components (1 hour)
- [ ] Show class icon in Home page
- [ ] Show level/rank badge in Home page
- [ ] Update mission submission to show potential bonus
- [ ] Show class multiplier in My Submissions (if approved)

### Phase 6: Testing & Polish (1 hour)
- [ ] Test class selection flow
- [ ] Test EXP multipliers
- [ ] Test level calculation
- [ ] Test rank display
- [ ] Error handling
- [ ] Loading states

**Total Estimated Time:** 7-8 hours

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (Blocking)
- [ ] Player can select character class (first-time)
- [ ] Cannot change class after selection (UI prevents)
- [ ] Class selection saved to database
- [ ] EXP multipliers work correctly:
  - Quran Protector + quran_reading = 1.2x
  - Da'i + community_service = 1.2x
  - Scholar + learning_quiz = 1.2x
  - Mu'min + any mission = 1.05x
  - No match = 1.0x (base)
- [ ] Level calculated correctly based on total_exp
- [ ] Level up detected when threshold reached
- [ ] Rank displayed based on level
- [ ] Character profile shows all info correctly
- [ ] No breaking changes to Fase 1E/1F functionality

### Should Have (Important)
- [ ] Class selection has smooth animation
- [ ] Level progress bar displays correctly
- [ ] Rank badge has appropriate styling
- [ ] Mission stats breakdown accurate
- [ ] Class icon displays consistently
- [ ] "Level Up!" celebration animation (optional)

### Nice to Have (Enhancement)
- [ ] Class selection tutorial/guide
- [ ] Level-up sound effect
- [ ] Rank badge glow effect
- [ ] Historical EXP chart
- [ ] Class leaderboard (per class)

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- calculate_level() function accuracy
- Class multiplier logic
- Level-up detection
- Rank calculation

### Integration Tests
- End-to-end: Select class → Submit mission → Approve → Verify EXP with multiplier
- Level-up flow
- Class persistence across sessions

### Manual Tests
- Select each class and verify saved
- Submit missions and verify correct multiplier applied
- Check level calculation at various EXP thresholds
- Verify rank badges display correctly
- Test profile page displays all data
- Verify no class selected shows selection modal

---

## 🐛 KNOWN LIMITATIONS

### Current Phase Limitations
1. **No class reset** - Players cannot change class (only Super Admin via SQL)
2. **No skill trees** - Classes only affect EXP multiplier (no unique abilities)
3. **No class-specific quests** - All quests available to all classes
4. **Single dungeon level** - Level is global, not per-dungeon
5. **No level-down** - Level only increases (cannot lose level)

### Future Enhancements (Post Fase 2)
- Class-specific abilities/skills
- Skill tree system
- Class reset feature (with confirmation)
- Per-dungeon level tracking
- Prestige system (reset to level 1 with bonuses)
- Class-exclusive quests
- Dual-class system

---

## 📊 SUCCESS METRICS

### Functional Metrics
- [ ] 100% of players can select class
- [ ] 0 errors in class selection
- [ ] EXP multipliers 100% accurate
- [ ] Level calculation 100% accurate
- [ ] Rank display 100% correct

### User Experience Metrics
- [ ] Class selection < 3 clicks
- [ ] Profile page load < 2s
- [ ] Clear visual feedback for selections
- [ ] No confusion about class bonuses

---

## 🔗 DEPENDENCIES

### From Previous Phases
- ✅ Fase 1E: GM Dashboard, approve_mission function
- ✅ Fase 1F: Mission submission, quest system
- ✅ Database: players table with level, total_exp

### External Libraries
- ✅ React Router (already installed)
- ✅ Supabase client (already installed)
- ✅ Lucide icons (already installed)
- ✅ Tailwind CSS (already installed)

### New Dependencies
**None required** - all libraries already available

---

## 📝 FILE STRUCTURE

```
src/
├── pages/
│   └── CharacterPage.jsx          # Profile/character info page
├── components/
│   ├── ClassSelectionModal.jsx    # First-time class selection
│   ├── ClassCard.jsx               # Individual class display card
│   ├── LevelProgressBar.jsx        # Visual EXP progress
│   ├── RankBadge.jsx               # Rank display component
│   └── MissionStats.jsx            # Mission breakdown by type
├── lib/
│   ├── supabase.js                 # Already exists
│   └── classUtils.js               # Class-related utilities
└── App.jsx                         # Add /character route
```

---

## 🚦 IMPLEMENTATION STATUS

- [ ] Planning & Documentation ✅ (This document)
- [ ] Database Migration
- [ ] Class Selection UI
- [ ] Profile Page Implementation
- [ ] Update Approval Function
- [ ] Integration & Testing
- [ ] Documentation Update

---

**Next Steps:**
1. Create database migration for character_class
2. Implement calculate_level() function
3. Update approve_mission() function
4. Build Class Selection Modal
5. Create Character Profile Page
6. Testing & refinement

---

**End of Fase 2 Planning Document**

*Ready for implementation - 13 Oktober 2026*
