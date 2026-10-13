# Test Scripts - Fase 1F

## 📁 Struktur Folder

```
test-scripts/
└── fase-1f/
    ├── test-database.js       # Automated database tests
    ├── test-frontend.js       # Frontend checklist generator (60 items)
    └── README.md              # This file
```

## 🚀 Cara Menjalankan

### Option 1: Node.js Automated Test

**Test Database:**
```bash
npm run test:fase1f:db
```

**Test Frontend Checklist:**
```bash
npm run test:fase1f:frontend
```

**Test All (Database + Frontend):**
```bash
npm run test:fase1f
```

## 📋 Test Coverage

### test-database.js
- ✅ Database schema verification (from Fase 1E)
- ✅ Quest master templates check
- ✅ Player data with dungeon assignment
- ✅ Active dungeon quests availability
- ✅ Mission submissions data
- ✅ RLS policies validation

### test-frontend.js
- ✅ 60-point manual testing checklist
- ✅ Missions page functionality
- ✅ Submission form validation
- ✅ My submissions page
- ✅ Status tracking (pending/approved/rejected)
- ✅ Navigation & integration
- ✅ Responsive design
- ✅ Error handling
- ✅ Security & RLS checks

## 📊 Expected Results

### Database Tests Should Pass With:
- ✅ mission_submissions, dungeon_quests, quest_master tables exist
- ✅ At least 10 quest master templates
- ✅ At least 1 player with dungeon assigned
- ✅ At least 1 active dungeon quest
- ✅ RLS policies functioning correctly

### Frontend Checklist Provides:
- 60 test items covering all features
- Prerequisites verification
- Step-by-step testing guide
- Automated data checks
- Next steps guidance

## 🎯 Prerequisites

Before running tests, ensure:
1. **Fase 1E completed** - GM Dashboard must be functional
2. **Database migrated** - All tables from Fase 1E exist
3. **Test data ready:**
   - At least 1 player with `dungeon_id` assigned
   - At least 2-3 active dungeon quests
   - Quest master templates seeded

### Setup Test Data

```sql
-- Assign player to dungeon
UPDATE players 
SET dungeon_id = 'YOUR_DUNGEON_ID' 
WHERE id = 'YOUR_PLAYER_ID';

-- Verify active quests exist
SELECT COUNT(*) FROM dungeon_quests 
WHERE dungeon_id = 'YOUR_DUNGEON_ID'
AND is_active = true;
-- Expected: At least 2
```

## ✅ Test Execution Flow

### Step 1: Run Automated Database Test
```bash
npm run test:fase1f:db
```

**If all pass:** Proceed to Step 2  
**If fail:** Fix database setup, check Fase 1E completion

### Step 2: Generate Frontend Checklist
```bash
npm run test:fase1f:frontend
```

This will:
- Display 60-item checklist
- Verify test data availability
- Provide next steps

### Step 3: Manual Testing
```bash
npm run dev
```

Follow the 60-item checklist:
1. Prerequisites (4 items)
2. Missions Page (6 items)
3. Submission Form (7 items)
4. Submit Success (6 items)
5. Submit with Photo (6 items)
6. My Submissions Page (8 items)
7. Approved Submission (3 items)
8. Rejected Submission (3 items)
9. Navigation & Integration (4 items)
10. Responsive Design (3 items)
11. Error Handling (6 items)
12. Security & RLS (4 items)

## 🐛 Troubleshooting

### Issue: "No players with dungeon assigned"
**Solution:**
```sql
UPDATE players 
SET dungeon_id = (SELECT id FROM dungeons LIMIT 1)
WHERE id = 'YOUR_PLAYER_ID';
```

### Issue: "No active dungeon quests"
**Solution:**
- Login as GM
- Go to `/gm` > "Quest Scheduling"
- Schedule at least 2 quests

### Issue: Database connection fails
**Solution:**
- Check `.env.local` has correct Supabase credentials
- Verify internet connection
- Check Supabase project is active

### Issue: Tests pass but UI doesn't work
**Solution:**
- Clear browser cache
- Check console for errors
- Verify you're logged in as player (not GM)
- Verify player has dungeon assigned

## 📖 Documentation

For comprehensive test documentation, see:
- `dokumentasi-test-dan-verifikasi/fase-1f/FASE_1F_TEST_DOCUMENTATION.md`

## 🔗 Dependencies

**From Fase 1E:**
- ✅ mission_submissions table
- ✅ dungeon_quests table
- ✅ quest_master table with seed data
- ✅ RLS policies
- ✅ GM Dashboard for validation

**New Components (Fase 1F):**
- MissionsPage.jsx
- MySubmissionsPage.jsx
- QuestCard.jsx
- SubmissionModal.jsx
- SubmissionCard.jsx
- StatusBadge.jsx

## 📊 Test Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Database Tests | 6 | 6 |
| Frontend Checklist Items | 60 | 60 |
| Execution Time | ~5 min | ~5 min |
| Manual Test Time | ~60 min | TBD |

## ✨ Success Criteria

Testing passes when:
- [x] All automated database tests pass
- [x] Player can view available missions
- [x] Player can submit missions
- [x] Player can view submission history
- [x] Player can see status updates (pending/approved/rejected)
- [x] Cannot submit duplicate (same quest, same day)
- [x] RLS policies enforce data isolation
- [x] No console errors
- [x] Mobile responsive

---

**Last Updated:** 13 Oktober 2026  
**Spirit Link Development Team**
