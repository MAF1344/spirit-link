# AUTOMATED TESTING GUIDE - FASE 1E

## 📁 Files Created

1. **test-fase-1e.sql** - SQL-based automated test (untuk Supabase Dashboard)
2. **scripts/test-database.js** - Node.js automated database tests
3. **scripts/test-frontend.js** - Frontend testing checklist generator

---

## 🚀 CARA MENJALANKAN

### Option 1: SQL Automated Test (Recommended untuk Database)

**Via Supabase Dashboard:**
1. Buka Supabase Dashboard
2. Pilih project Spirit Link
3. Klik "SQL Editor"
4. Copy-paste seluruh isi file `test-fase-1e.sql`
5. Klik "Run"
6. Periksa output untuk ✓ PASS atau ✗ FAIL

**Kelebihan:**
- Langsung test di database
- Tidak perlu setup Node.js
- Real-time verification

---

### Option 2: Node.js Automated Test

**Step 1: Install Dependencies (jika belum)**
```bash
npm install
```

**Step 2: Run Database Tests**
```bash
npm run test:db
```

**Output yang diharapkan:**
```
=========================================
🧪 FASE 1E DATABASE TESTS
=========================================

--- TEST 1: Database Tables ---
✓ PASS: user_roles table exists
✓ PASS: quest_master table exists
✓ PASS: dungeon_quests table exists
✓ PASS: mission_submissions table exists
✓ PASS: dungeon_admins table exists

--- TEST 2: Quest Master Seed Data ---
✓ PASS: Quest master has 10 templates
✓ PASS: All quest templates are active

--- TEST 3: Available Test Data ---
   Users available: 3
   Dungeons available: 2
   Example: Masjid Al-Ikhlas (abc-123)
   Players available: 5
   Example: Warrior123 (def-456)

--- TEST 4: Existing Test Setup ---
   User roles: 1
   Dungeon admins: 1
   Dungeon quests: 2
   Pending submissions: 1

=========================================
TEST SUMMARY
=========================================
✓ Passed: 7
✗ Failed: 0

🎉 All database tests passed!
✅ Test data ready for frontend testing!
```

**Step 3: Run Frontend Checklist**
```bash
npm run test:frontend
```

**Output:**
- Checklist lengkap untuk manual testing
- Verifikasi data yang tersedia
- Instruksi step-by-step

**Step 4: Run All Tests**
```bash
npm run test:fase1e
```

---

## ✅ TESTING WORKFLOW

### Phase 1: Database Verification (Automated)
```bash
npm run test:db
```
**Expected:** All tests PASS

### Phase 2: Test Data Setup (Manual/SQL)
Jika test data belum ada, jalankan command dari output test:
```sql
-- 1. Create user role
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_ID', 'mosque_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'mosque_admin';

-- 2. Assign dungeon admin
INSERT INTO dungeon_admins (user_id, dungeon_id) 
VALUES ('YOUR_USER_ID', 'YOUR_DUNGEON_ID');

-- 3. Create dungeon quest
INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type, is_active)
VALUES ('YOUR_DUNGEON_ID', 'QUEST_MASTER_ID', 'daily', true);

-- 4. Create mission submission
INSERT INTO mission_submissions (
  player_id, dungeon_quest_id, dungeon_id, 
  submission_type, notes, status
)
VALUES (
  'YOUR_PLAYER_ID', 
  'DUNGEON_QUEST_ID', 
  'YOUR_DUNGEON_ID',
  'text', 
  'Test submission untuk validasi', 
  'pending'
);
```

### Phase 3: Frontend Testing (Manual)
```bash
npm run test:frontend
npm run dev
```
Then follow the checklist output.

---

## 📊 EXPECTED RESULTS

### ✅ All Tests Pass When:
- [ ] 5 tables exist (user_roles, quest_master, dungeon_quests, mission_submissions, dungeon_admins)
- [ ] 4 functions exist (approve_mission, reject_mission, is_dungeon_admin, is_super_admin)
- [ ] 10 quest templates in quest_master
- [ ] RLS policies enabled on all tables
- [ ] Test data created (at least 1 user role, 1 dungeon admin, 1 quest, 1 submission)
- [ ] GM Dashboard accessible at http://localhost:5173/gm
- [ ] Non-GM users cannot access dashboard
- [ ] Approval workflow works correctly
- [ ] No console errors
- [ ] No SQL errors in Supabase logs

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install
```

### Issue: "Missing Supabase credentials"
**Solution:** Check `.env.local` file exists with:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Issue: All database tests fail
**Solution:** Migration belum di-apply. Run:
```bash
supabase db push
```

### Issue: "Table does not exist"
**Solution:** Check migration file applied correctly via Supabase Dashboard

### Issue: No pending submissions found
**Solution:** Create test submission manually (see Phase 2)

---

## 📝 MANUAL CHECKLIST

Setelah automated tests pass, lakukan manual testing:

### Access Control
- [ ] Login as mosque_admin works
- [ ] Dashboard accessible at /gm
- [ ] Non-GM user gets "Access Denied"
- [ ] Unauthenticated redirect to /login

### Tab 1: Validasi Misi
- [ ] Pending submissions list displays
- [ ] Approve button works
- [ ] Reject button works with reason
- [ ] Submission disappears after validation
- [ ] EXP awarded correctly

### Tab 2: Quest Scheduling
- [ ] Active quests list displays
- [ ] "+ Jadwalkan Quest" button opens modal
- [ ] Quest templates load
- [ ] Schedule form works
- [ ] New quest appears after scheduling
- [ ] Toggle active/inactive works

### Tab 3: Quest Master
- [ ] 10 templates display
- [ ] All badges show correctly
- [ ] Read-only notice for mosque_admin
- [ ] Inactive quests marked properly

### Error Handling
- [ ] No console errors
- [ ] No network errors
- [ ] Loading states work
- [ ] Error messages clear

---

## ✨ SUCCESS CRITERIA

**FASE 1E is COMPLETE when:**
1. ✅ `npm run test:db` returns 0 failures
2. ✅ All 37 manual checklist items checked
3. ✅ No console errors during testing
4. ✅ No SQL errors in Supabase logs
5. ✅ Approval workflow successfully awards EXP
6. ✅ Access control prevents unauthorized access

---

## 🎯 NEXT PHASE

After all tests pass:
```
FASE 1E ✅ COMPLETE
Ready for: FASE 2 - Character Classes, Inventory, Leaderboards
```

---

**Generated:** 13 Oktober 2026  
**Spirit Link Development Team**
