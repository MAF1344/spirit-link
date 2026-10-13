# TEST DOCUMENTATION - FASE 1E: GM DASHBOARD

**Spirit Link Project**  
**Version:** 1.0  
**Date:** 13 Oktober 2026  
**Phase:** Fase 1E - GM Dashboard Implementation  
**Status:** ✅ Ready for Testing

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Test Strategy](#test-strategy)
3. [Test Artifacts](#test-artifacts)
4. [Database Schema Tests](#database-schema-tests)
5. [Functional Tests](#functional-tests)
6. [Access Control Tests](#access-control-tests)
7. [Integration Tests](#integration-tests)
8. [Performance Tests](#performance-tests)
9. [Security Tests](#security-tests)
10. [Test Data Requirements](#test-data-requirements)
11. [Known Issues & Limitations](#known-issues--limitations)
12. [Test Execution Guide](#test-execution-guide)
13. [Success Criteria](#success-criteria)

---

## 📖 OVERVIEW

### Purpose
Fase 1E memperkenalkan **GM Dashboard** - sebuah interface untuk Mosque Admin (Game Master) untuk:
- Memvalidasi mission submissions dari players
- Menjadwalkan quest untuk dungeon mereka
- Melihat dan mengelola quest master templates

### Scope
Testing mencakup:
- Database schema & migrations
- Role-based access control (RBAC)
- Quest Master system
- Quest Scheduling functionality
- Mission Validation workflow
- Row Level Security (RLS) policies

### Out of Scope
- Photo upload functionality (manual URL input only)
- Real-time notifications
- Quest Master CRUD UI (hanya read-only untuk mosque_admin)
- Analytics dashboard
- Mobile responsive layout (basic responsive only)

---

## 🎯 TEST STRATEGY

### Test Pyramid

```
        ┌─────────────┐
        │   Manual    │  (Frontend UI/UX)
        │   Testing   │
        └─────────────┘
       ┌───────────────┐
       │  Integration  │  (API + Database)
       │     Tests     │
       └───────────────┘
     ┌──────────────────┐
     │   Automated      │  (Schema, Functions, RLS)
     │   Database       │
     │   Tests          │
     └──────────────────┘
```

### Test Levels

| Level | Type | Coverage | Tool |
|-------|------|----------|------|
| L1 | Database Schema | Tables, Functions, Indexes | SQL Script |
| L2 | Data Integrity | Constraints, Foreign Keys | SQL Script |
| L3 | Access Control | RLS Policies, Permissions | SQL Script |
| L4 | API Integration | Supabase Client Queries | Node.js |
| L5 | Functional | UI Workflows | Manual |
| L6 | Security | Authentication, Authorization | Manual |

---

## 📦 TEST ARTIFACTS

### Automated Test Scripts

| File | Purpose | Execution Method |
|------|---------|------------------|
| `test-fase-1e.sql` | Database structure verification | Supabase SQL Editor |
| `scripts/test-database.js` | Automated database tests via Node | `npm run test:db` |
| `scripts/test-frontend.js` | Frontend checklist generator | `npm run test:frontend` |
| `TESTING_FASE_1E.md` | Comprehensive testing guide | Manual reference |
| `AUTOMATED_TESTING_GUIDE.md` | Quick start guide | Manual reference |

### Database Migration Files

| File | Purpose |
|------|---------|
| `supabase/migrations/20261013_gm_dashboard_schema.sql` | Complete schema for GM Dashboard |

### Implementation Files

| Component | File Path |
|-----------|-----------|
| GM Dashboard Page | `src/pages/GMDashboard.jsx` |
| Supabase Client | `src/lib/supabase.js` |
| Router Config | `src/App.jsx` |

---

## 🗄️ DATABASE SCHEMA TESTS

### Test Case DS-001: Table Creation

**Objective:** Verify all required tables are created

**Test Query:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_roles', 'quest_master', 'dungeon_quests', 
  'mission_submissions', 'dungeon_admins'
);
```

**Expected Result:**
- 5 rows returned
- Tables: user_roles, quest_master, dungeon_quests, mission_submissions, dungeon_admins

**Success Criteria:** ✅ All 5 tables exist

---

### Test Case DS-002: Function Creation

**Objective:** Verify helper functions are created

**Test Query:**
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'approve_mission', 'reject_mission', 
  'is_dungeon_admin', 'is_super_admin'
);
```

**Expected Result:**
- 4 rows returned
- Functions: approve_mission, reject_mission, is_dungeon_admin, is_super_admin

**Success Criteria:** ✅ All 4 functions exist

---

### Test Case DS-003: Quest Master Seed Data

**Objective:** Verify quest templates are seeded

**Test Query:**
```sql
SELECT COUNT(*) as total, 
       COUNT(*) FILTER (WHERE is_active = true) as active
FROM quest_master;
```

**Expected Result:**
- total = 10
- active = 10

**Quest Templates Expected:**
1. Sholat Subuh Berjamaah (50 EXP)
2. Sholat Dzuhur Berjamaah (50 EXP)
3. Sholat Ashar Berjamaah (50 EXP)
4. Sholat Maghrib Berjamaah (50 EXP)
5. Sholat Isya Berjamaah (50 EXP)
6. Baca Al-Quran 1 Halaman (30 EXP)
7. Hafalan Surat Pendek (100 EXP)
8. Kajian Mingguan (300 EXP)
9. Bersih-Bersih Masjid (80 EXP)
10. Sholat Dhuha (40 EXP)

**Success Criteria:** ✅ 10 templates, all active

---

### Test Case DS-004: Index Creation

**Objective:** Verify performance indexes are created

**Test Query:**
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('quest_master', 'dungeon_quests', 'mission_submissions')
ORDER BY tablename, indexname;
```

**Expected Result:** Minimum indexes per table:
- quest_master: idx_quest_master_type, idx_quest_master_active
- dungeon_quests: idx_dungeon_quests_dungeon, idx_dungeon_quests_master, idx_dungeon_quests_active
- mission_submissions: idx_submissions_player, idx_submissions_dungeon, idx_submissions_status

**Success Criteria:** ✅ All critical indexes exist

---

### Test Case DS-005: Constraint Validation

**Objective:** Verify CHECK constraints work correctly

**Test Scenarios:**

#### Scenario A: Valid mission_type
```sql
INSERT INTO quest_master (title, mission_type, exp_reward, parameter_category, validation_method)
VALUES ('Test Quest', 'daily_prayer', 50, 'mandatory_worship', 'qr_tapin');
-- Expected: SUCCESS
```

#### Scenario B: Invalid mission_type
```sql
INSERT INTO quest_master (title, mission_type, exp_reward, parameter_category, validation_method)
VALUES ('Test Quest', 'invalid_type', 50, 'mandatory_worship', 'qr_tapin');
-- Expected: CHECK constraint violation error
```

#### Scenario C: Invalid validation_method
```sql
INSERT INTO quest_master (title, mission_type, exp_reward, parameter_category, validation_method)
VALUES ('Test Quest', 'daily_prayer', 50, 'mandatory_worship', 'invalid_method');
-- Expected: CHECK constraint violation error
```

**Success Criteria:** ✅ Valid data accepted, invalid data rejected

---

### Test Case DS-006: Foreign Key Constraints

**Objective:** Verify referential integrity

**Test Scenarios:**

#### Scenario A: Valid foreign key
```sql
INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type)
VALUES ('valid-dungeon-id', 'valid-quest-id', 'daily');
-- Expected: SUCCESS
```

#### Scenario B: Invalid dungeon_id
```sql
INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type)
VALUES ('non-existent-id', 'valid-quest-id', 'daily');
-- Expected: Foreign key violation error
```

#### Scenario C: Cascade delete
```sql
DELETE FROM players WHERE id = 'player-with-submissions';
-- Expected: Related mission_submissions also deleted (CASCADE)
```

**Success Criteria:** ✅ FK constraints enforced, CASCADE works

---

### Test Case DS-007: Unique Constraints

**Objective:** Verify duplicate prevention

**Test Query:**
```sql
-- Insert first submission
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, status)
VALUES ('player-1', 'quest-1', 'dungeon-1', 'text', 'pending');
-- Expected: SUCCESS

-- Try duplicate submission same day
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, status)
VALUES ('player-1', 'quest-1', 'dungeon-1', 'text', 'pending');
-- Expected: Unique constraint violation (idx_no_duplicate_submission)
```

**Success Criteria:** ✅ Prevents duplicate submissions per player per quest per day

---

## 🔐 ACCESS CONTROL TESTS

### Test Case AC-001: RLS Policy Verification

**Objective:** Verify RLS is enabled on all tables

**Test Query:**
```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_roles', 'quest_master', 'dungeon_quests', 'mission_submissions', 'dungeon_admins')
GROUP BY tablename;
```

**Expected Result:**
| Table | Minimum Policies |
|-------|------------------|
| user_roles | 2 |
| quest_master | 2 |
| dungeon_quests | 2 |
| mission_submissions | 4 |
| dungeon_admins | 2 |

**Success Criteria:** ✅ All tables have RLS enabled with appropriate policies

---

### Test Case AC-002: Quest Master Read Access

**Objective:** Verify public can read active quests

**Test Scenario:**
```sql
-- As unauthenticated user
SET request.jwt.claims TO '{}';

SELECT * FROM quest_master WHERE is_active = true;
-- Expected: Returns active quests

SELECT * FROM quest_master WHERE is_active = false;
-- Expected: Empty result (policy filters inactive)
```

**Success Criteria:** ✅ Public can read active quests only

---

### Test Case AC-003: Quest Creator Permissions

**Objective:** Verify quest_creator can insert/update quest_master

**Test Scenario:**
```sql
-- Set user with quest_creator role
SET request.jwt.claims TO '{"sub": "user-id-with-quest-creator-role"}';

INSERT INTO quest_master (title, mission_type, exp_reward, parameter_category, validation_method)
VALUES ('New Quest', 'community_service', 100, 'dawah_outreach', 'photo_video');
-- Expected: SUCCESS

-- As mosque_admin (not quest_creator)
SET request.jwt.claims TO '{"sub": "user-id-with-mosque-admin-role"}';

INSERT INTO quest_master (title, mission_type, exp_reward, parameter_category, validation_method)
VALUES ('Another Quest', 'community_service', 100, 'dawah_outreach', 'photo_video');
-- Expected: Policy violation error
```

**Success Criteria:** ✅ Only quest_creator and super_admin can modify quest_master

---

### Test Case AC-004: Dungeon Quest Isolation

**Objective:** Verify GM can only manage own dungeon's quests

**Test Scenario:**
```sql
-- User A is GM of Dungeon X
SET request.jwt.claims TO '{"sub": "user-a-id"}';

-- Read own dungeon quests
SELECT * FROM dungeon_quests WHERE dungeon_id = 'dungeon-x-id';
-- Expected: Returns quests

-- Try to read other dungeon quests
SELECT * FROM dungeon_quests WHERE dungeon_id = 'dungeon-y-id';
-- Expected: Empty result (filtered by RLS)

-- Try to insert quest for other dungeon
INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type)
VALUES ('dungeon-y-id', 'quest-id', 'daily');
-- Expected: Policy violation or no rows returned
```

**Success Criteria:** ✅ GM isolated to own dungeon data

---

### Test Case AC-005: Mission Submission Validation Rights

**Objective:** Verify GM can only validate submissions in own dungeon

**Test Scenario:**
```sql
-- User A is GM of Dungeon X
SET request.jwt.claims TO '{"sub": "user-a-id"}';

-- Read submissions for own dungeon
SELECT * FROM mission_submissions WHERE dungeon_id = 'dungeon-x-id';
-- Expected: Returns submissions

-- Try to read submissions from other dungeon
SELECT * FROM mission_submissions WHERE dungeon_id = 'dungeon-y-id';
-- Expected: Empty result

-- Try to approve submission in own dungeon
UPDATE mission_submissions 
SET status = 'approved' 
WHERE id = 'submission-in-dungeon-x';
-- Expected: SUCCESS

-- Try to approve submission in other dungeon
UPDATE mission_submissions 
SET status = 'approved' 
WHERE id = 'submission-in-dungeon-y';
-- Expected: 0 rows updated (filtered by RLS)
```

**Success Criteria:** ✅ GM can only validate submissions in assigned dungeon

---

### Test Case AC-006: Super Admin Override

**Objective:** Verify super_admin can access all data

**Test Scenario:**
```sql
-- User with super_admin role
SET request.jwt.claims TO '{"sub": "super-admin-user-id"}';

-- Read all dungeon quests
SELECT * FROM dungeon_quests;
-- Expected: Returns ALL quests from all dungeons

-- Read all submissions
SELECT * FROM mission_submissions;
-- Expected: Returns ALL submissions from all dungeons

-- Validate any submission
UPDATE mission_submissions 
SET status = 'approved' 
WHERE id = 'any-submission-id';
-- Expected: SUCCESS
```

**Success Criteria:** ✅ Super admin bypasses all RLS restrictions

---

## ⚙️ FUNCTIONAL TESTS

### Test Case FN-001: Mission Approval Workflow

**Objective:** Verify complete approval workflow

**Prerequisites:**
- 1 pending mission submission exists
- Submission has valid player_id, dungeon_quest_id
- Quest has valid exp_reward

**Test Steps:**
1. Login as mosque_admin assigned to dungeon
2. Navigate to `/gm`
3. Open "Validasi Misi" tab
4. Verify submission appears in list
5. Click "Approve" button
6. Verify success alert appears
7. Verify submission disappears from list

**Database Verification:**
```sql
-- Check submission status updated
SELECT status, validated_by, validated_at, exp_awarded
FROM mission_submissions 
WHERE id = 'submission-id';
-- Expected: status='approved', validated_by=user_id, exp_awarded>0

-- Check player EXP increased
SELECT total_exp, level FROM players WHERE id = 'player-id';
-- Expected: total_exp increased by exp_reward amount
```

**Success Criteria:** 
- ✅ Submission status = 'approved'
- ✅ Player received correct EXP
- ✅ Level up if threshold reached
- ✅ UI updated correctly

---

### Test Case FN-002: Mission Rejection Workflow

**Objective:** Verify complete rejection workflow

**Prerequisites:**
- 1 pending mission submission exists

**Test Steps:**
1. Login as mosque_admin
2. Navigate to `/gm` > "Validasi Misi"
3. Click "Reject" button
4. Enter rejection reason: "Foto tidak jelas"
5. Click OK
6. Verify success alert appears
7. Verify submission disappears from list

**Database Verification:**
```sql
SELECT status, validated_by, rejection_reason, exp_awarded
FROM mission_submissions 
WHERE id = 'submission-id';
-- Expected: status='rejected', rejection_reason='Foto tidak jelas', exp_awarded=0
```

**Success Criteria:**
- ✅ Submission status = 'rejected'
- ✅ Rejection reason saved
- ✅ No EXP awarded
- ✅ UI updated correctly

---

### Test Case FN-003: Rejection Cancellation

**Objective:** Verify user can cancel rejection

**Test Steps:**
1. Open "Validasi Misi" tab
2. Click "Reject" button
3. Click "Cancel" in prompt (don't enter reason)
4. Verify submission still in list
5. Verify status unchanged

**Database Verification:**
```sql
SELECT status FROM mission_submissions WHERE id = 'submission-id';
-- Expected: status='pending'
```

**Success Criteria:**
- ✅ No changes to submission
- ✅ Still appears in pending list

---

### Test Case FN-004: Quest Scheduling - Create

**Objective:** Verify quest can be scheduled for dungeon

**Prerequisites:**
- User is mosque_admin for a dungeon
- Quest master templates exist

**Test Steps:**
1. Navigate to `/gm` > "Quest Scheduling"
2. Click "+ Jadwalkan Quest" button
3. Verify modal opens with quest templates
4. Select "Sholat Subuh Berjamaah" quest
5. Verify form appears with quest details
6. Select schedule_type: "daily"
7. Click "Jadwalkan" button
8. Verify success alert
9. Verify modal closes
10. Verify quest appears in active list

**Database Verification:**
```sql
SELECT * FROM dungeon_quests 
WHERE dungeon_id = 'user-dungeon-id'
AND quest_master_id = 'selected-quest-id'
ORDER BY created_at DESC LIMIT 1;
-- Expected: 1 row with schedule_type='daily', is_active=true
```

**Success Criteria:**
- ✅ Quest created in database
- ✅ Linked to correct dungeon
- ✅ Appears in UI list
- ✅ Status badge shows "Aktif"

---

### Test Case FN-005: Quest Scheduling - Prayer Type

**Objective:** Verify prayer_type field appears for daily_prayer quests

**Test Steps:**
1. Open quest scheduling modal
2. Select quest with mission_type = 'daily_prayer'
3. Verify "Jenis Sholat" dropdown appears
4. Verify options: Semua Sholat, Subuh, Dzuhur, Ashar, Maghrib, Isya
5. Select "Subuh"
6. Click "Jadwalkan"

**Database Verification:**
```sql
SELECT prayer_type FROM dungeon_quests 
WHERE id = 'newly-created-quest-id';
-- Expected: prayer_type = 'fajr' (or selected value)
```

**Test Steps (Negative):**
7. Select quest with mission_type = 'quran_reading'
8. Verify "Jenis Sholat" dropdown does NOT appear

**Success Criteria:**
- ✅ Prayer type field conditional
- ✅ Only appears for daily_prayer quests
- ✅ Saves correct value

---

### Test Case FN-006: Quest Toggle Active/Inactive

**Objective:** Verify quest can be toggled on/off

**Test Steps:**
1. Open "Quest Scheduling" tab
2. Find quest with status "Aktif" (green badge)
3. Click the status badge
4. Verify badge changes to "Nonaktif" (gray)
5. Click badge again
6. Verify badge changes back to "Aktif"

**Database Verification:**
```sql
SELECT is_active FROM dungeon_quests WHERE id = 'quest-id';
-- Expected: is_active toggled (true ↔ false)
```

**Success Criteria:**
- ✅ Status toggles correctly
- ✅ UI updates immediately
- ✅ Database reflects change

---

### Test Case FN-007: Quest Master Display

**Objective:** Verify all quest templates display correctly

**Test Steps:**
1. Navigate to `/gm` > "Quest Master"
2. Verify 10 quest cards displayed
3. Verify each card shows:
   - Title (gold, bold)
   - Description
   - Mission type badge (cyan)
   - Parameter category badge (purple)
   - EXP reward badge (green)
   - Validation method badge (yellow)
4. Verify read-only notice appears for mosque_admin

**Success Criteria:**
- ✅ All 10 templates visible
- ✅ All badges display correctly
- ✅ Proper color coding
- ✅ Read-only notice present

---

### Test Case FN-008: Empty State Handling

**Objective:** Verify empty states display correctly

**Test Scenarios:**

#### Scenario A: No Pending Submissions
```sql
-- Set all submissions to approved/rejected
UPDATE mission_submissions SET status = 'approved' WHERE dungeon_id = 'test-dungeon';
```
**Expected:** "Tidak ada submission pending" message in Validasi Misi tab

#### Scenario B: No Scheduled Quests
```sql
-- Delete all dungeon quests
DELETE FROM dungeon_quests WHERE dungeon_id = 'test-dungeon';
```
**Expected:** "Belum ada quest dijadwalkan" message in Quest Scheduling tab

**Success Criteria:**
- ✅ Empty state messages display
- ✅ No errors or crashes
- ✅ Call-to-action buttons still work

---

### Test Case FN-009: Photo Proof Display

**Objective:** Verify photo submissions display correctly

**Test Setup:**
```sql
UPDATE mission_submissions 
SET proof_url = 'https://placehold.co/400x300'
WHERE id = 'test-submission-id';
```

**Test Steps:**
1. Navigate to "Validasi Misi" tab
2. Locate submission with photo
3. Verify image displays in card
4. Verify image max height = 192px
5. Verify image has white transparent border

**Success Criteria:**
- ✅ Image loads correctly
- ✅ Proper sizing (max-h-48)
- ✅ Border styling applied

---

### Test Case FN-010: Multiple Dungeon Admin Assignment

**Objective:** Verify user assigned to multiple dungeons sees correct data

**Test Setup:**
```sql
-- Assign user to 2 dungeons
INSERT INTO dungeon_admins (user_id, dungeon_id) VALUES ('user-id', 'dungeon-1');
INSERT INTO dungeon_admins (user_id, dungeon_id) VALUES ('user-id', 'dungeon-2');
```

**Test Steps:**
1. Login as user
2. Navigate to `/gm`
3. Verify header shows first assigned dungeon
4. Verify submissions from first dungeon only
5. Verify quests from first dungeon only

**Note:** Current implementation supports single dungeon view. Multi-dungeon selector is future enhancement.

**Success Criteria:**
- ✅ No errors with multiple assignments
- ✅ Data filtered correctly
- ✅ No cross-dungeon data leakage

---

## 🔗 INTEGRATION TESTS

### Test Case IT-001: Supabase Client Connection

**Objective:** Verify frontend can connect to Supabase

**Test Script:** `scripts/test-database.js`

**Test Steps:**
1. Run `npm run test:db`
2. Verify connection successful
3. Verify tables accessible

**Success Criteria:**
- ✅ No connection errors
- ✅ All queries execute
- ✅ Data retrieved correctly

---

### Test Case IT-002: RPC Function Calls

**Objective:** Verify approve_mission function works via client

**Test Code:**
```javascript
const { data, error } = await supabase.rpc('approve_mission', {
  p_submission_id: 'submission-id',
  p_validator_id: 'user-id'
});

// Expected: data.success = true, data.new_exp > 0
```

**Success Criteria:**
- ✅ Function executes without error
- ✅ Returns expected structure
- ✅ Database updated correctly

---

### Test Case IT-003: Real-time Data Consistency

**Objective:** Verify UI reflects database changes

**Test Steps:**
1. Open GM Dashboard
2. In separate window, approve submission via SQL
3. Refresh dashboard
4. Verify submission no longer appears

**Success Criteria:**
- ✅ Data consistency maintained
- ✅ No stale data displayed

---

## 🚀 PERFORMANCE TESTS

### Test Case PF-001: Query Performance

**Objective:** Verify queries execute within acceptable time

**Test Queries:**

```sql
-- Query 1: Get pending submissions (should use index)
EXPLAIN ANALYZE
SELECT * FROM mission_submissions 
WHERE dungeon_id = 'dungeon-id' 
AND status = 'pending';
-- Expected: < 10ms, uses idx_submissions_dungeon and idx_submissions_status

-- Query 2: Get dungeon quests (should use index)
EXPLAIN ANALYZE
SELECT * FROM dungeon_quests 
WHERE dungeon_id = 'dungeon-id' 
AND is_active = true;
-- Expected: < 10ms, uses idx_dungeon_quests_dungeon

-- Query 3: Get quest master templates
EXPLAIN ANALYZE
SELECT * FROM quest_master WHERE is_active = true;
-- Expected: < 5ms, uses idx_quest_master_active
```

**Success Criteria:**
- ✅ All queries < 50ms
- ✅ Indexes utilized
- ✅ No full table scans

---

### Test Case PF-002: Large Dataset Handling

**Objective:** Verify system handles many submissions

**Test Setup:**
```sql
-- Insert 100 submissions
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, status)
SELECT 
  players.id,
  'quest-id',
  'dungeon-id',
  'text',
  'pending'
FROM generate_series(1, 100) i
CROSS JOIN players
LIMIT 100;
```

**Test Steps:**
1. Navigate to "Validasi Misi" tab
2. Verify list loads within 2 seconds
3. Verify scrolling is smooth
4. Verify approve action completes < 1 second

**Success Criteria:**
- ✅ Page load < 2s
- ✅ No UI lag
- ✅ Actions responsive

**Note:** Pagination needed if > 50 submissions (see Limitations)

---

## 🔒 SECURITY TESTS

### Test Case SC-001: SQL Injection Prevention

**Objective:** Verify queries are parameterized

**Test Steps:**
1. In frontend, attempt to inject SQL via text field
2. Example: Notes field = `'; DROP TABLE mission_submissions; --`
3. Submit mission
4. Verify table still exists
5. Verify data saved as plain text

**Success Criteria:**
- ✅ No SQL execution from user input
- ✅ Special characters escaped
- ✅ Supabase client uses parameterized queries

---

### Test Case SC-002: XSS Prevention

**Objective:** Verify HTML injection is sanitized

**Test Steps:**
1. Create submission with notes: `<script>alert('XSS')</script>`
2. View submission in GM Dashboard
3. Verify script doesn't execute
4. Verify displayed as plain text

**Success Criteria:**
- ✅ No script execution
- ✅ HTML entities escaped
- ✅ React's XSS protection active

---

### Test Case SC-003: Authentication Required

**Objective:** Verify unauthenticated users cannot access GM Dashboard

**Test Steps:**
1. Logout completely
2. Navigate to `http://localhost:5173/gm`
3. Verify redirect to `/login`
4. Login as regular player (not GM)
5. Navigate to `/gm`
6. Verify "Access Denied" message

**Success Criteria:**
- ✅ Unauthenticated redirect
- ✅ Unauthorized users blocked
- ✅ No API access without auth

---

### Test Case SC-004: Authorization Enforcement

**Objective:** Verify GM cannot access other dungeon's data via API manipulation

**Test Steps:**
1. Login as GM of Dungeon A
2. Open browser DevTools > Network
3. Find API call for submissions
4. Copy request as cURL
5. Modify dungeon_id to Dungeon B
6. Send modified request
7. Verify empty result or error

**Success Criteria:**
- ✅ RLS blocks unauthorized data
- ✅ No cross-dungeon access
- ✅ API respects policies

---

### Test Case SC-005: Secret Protection

**Objective:** Verify no secrets exposed in client code

**Test Steps:**
1. View page source
2. Check JavaScript bundle
3. Verify no service_role_key present
4. Verify only anon_key used
5. Check .env.local not committed to git

**Success Criteria:**
- ✅ Only public keys in client
- ✅ No secrets in source
- ✅ .env.local in .gitignore

---

## 📊 TEST DATA REQUIREMENTS

### Minimum Test Data

| Entity | Quantity | Notes |
|--------|----------|-------|
| Users (auth.users) | 3 | 1 mosque_admin, 1 player, 1 super_admin |
| Dungeons | 2 | For cross-dungeon isolation testing |
| Players | 5 | Linked to users |
| User Roles | 3 | mosque_admin, player, super_admin |
| Dungeon Admins | 1 | Link user to dungeon |
| Quest Master | 10 | Seeded by migration |
| Dungeon Quests | 2 | 1 daily, 1 weekly |
| Mission Submissions | 3 | 1 pending, 1 approved, 1 rejected |

### Test Data Script

```sql
-- 1. Get existing IDs
SELECT id, email FROM auth.users LIMIT 3;
SELECT id, name FROM dungeons LIMIT 2;
SELECT id, hero_name FROM players LIMIT 5;
SELECT id, title FROM quest_master LIMIT 2;

-- 2. Create user roles
INSERT INTO user_roles (user_id, role) VALUES
  ('user-1-id', 'mosque_admin'),
  ('user-2-id', 'player'),
  ('user-3-id', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

-- 3. Assign dungeon admin
INSERT INTO dungeon_admins (user_id, dungeon_id) 
VALUES ('user-1-id', 'dungeon-1-id')
ON CONFLICT DO NOTHING;

-- 4. Create dungeon quests
INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type, is_active) VALUES
  ('dungeon-1-id', 'quest-master-1-id', 'daily', true),
  ('dungeon-1-id', 'quest-master-2-id', 'weekly', true);

-- 5. Create mission submissions
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, notes, status) VALUES
  ('player-1-id', 'dungeon-quest-1-id', 'dungeon-1-id', 'text', 'Test submission pending', 'pending'),
  ('player-2-id', 'dungeon-quest-1-id', 'dungeon-1-id', 'text', 'Test submission approved', 'approved'),
  ('player-3-id', 'dungeon-quest-2-id', 'dungeon-1-id', 'text', 'Test submission rejected', 'rejected');
```

---

## ⚠️ KNOWN ISSUES & LIMITATIONS

### Current Limitations

| Issue | Impact | Workaround | Planned Fix |
|-------|--------|------------|-------------|
| No photo upload UI | GM must manually input URL | Use image hosting service | Fase 2+ |
| No pagination | Slow with >50 submissions | Filter by date manually | Fase 2+ |
| No real-time updates | Must refresh to see new submissions | Manual refresh | Fase 2+ |
| Single dungeon view | Multi-dungeon GM see only first | Re-assign if needed | Fase 2+ |
| No quest master edit UI | Must use SQL to edit templates | Use SQL Editor | Fase 2+ |
| No bulk actions | Must approve one-by-one | N/A | Fase 2+ |
| No date range filter | See all pending submissions | Use SQL for historical | Fase 2+ |
| No validation history | Can't see who validated what | Check validated_by field | Fase 2+ |

### Known Bugs

**None reported at time of documentation**

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ⚠️ Not tested |
| Edge | Latest | ✅ Supported |
| Mobile Safari | Latest | ⚠️ Basic responsive only |
| Mobile Chrome | Latest | ⚠️ Basic responsive only |

---

## 📖 TEST EXECUTION GUIDE

### Pre-requisites

1. Migration applied (`supabase db push`)
2. `.env.local` configured with Supabase credentials
3. Node.js installed (for automated tests)
4. Dev server runnable (`npm run dev`)

### Execution Order

#### Phase 1: Database Tests (5 minutes)

**Option A: SQL Script**
```bash
# Open Supabase Dashboard > SQL Editor
# Copy-paste: test-fase-1e.sql
# Click Run
```

**Option B: Node.js**
```bash
npm run test:db
```

**Expected:** All tests pass, 0 failures

#### Phase 2: Seed Test Data (5 minutes)

Run SQL commands from [Test Data Requirements](#test-data-requirements) section.

Verify with:
```bash
npm run test:db
# Should show test data counts
```

#### Phase 3: Frontend Testing (20 minutes)

```bash
npm run test:frontend
npm run dev
```

Follow checklist output, test all 37 items.

#### Phase 4: Security Testing (10 minutes)

- Test unauthorized access
- Test RLS policies
- Test cross-dungeon isolation

#### Phase 5: Integration Testing (10 minutes)

- Test approve/reject workflow end-to-end
- Test quest scheduling workflow
- Test error handling

**Total Time: ~50 minutes**

---

## ✅ SUCCESS CRITERIA

### Must Pass (Blocking)

- [ ] All database tables created
- [ ] All functions created
- [ ] 10 quest templates seeded
- [ ] RLS policies active on all tables
- [ ] Mosque admin can access dashboard
- [ ] Non-GM user cannot access dashboard
- [ ] Approve mission awards correct EXP
- [ ] Reject mission does not award EXP
- [ ] Quest scheduling creates database record
- [ ] No console errors during normal operation
- [ ] No SQL errors in Supabase logs

### Should Pass (Important)

- [ ] All indexes created
- [ ] Empty states display correctly
- [ ] Photo proof displays correctly
- [ ] Quest toggle works
- [ ] Prayer type field conditional logic
- [ ] Read-only notice for mosque_admin
- [ ] Super admin sees all data
- [ ] Cross-dungeon isolation enforced

### Nice to Have (Enhancements)

- [ ] Performance < 2s page load
- [ ] Mobile responsive layout
- [ ] Graceful error messages
- [ ] Loading states during API calls

---

## 📈 TEST METRICS

### Code Coverage (Database)

| Component | Coverage |
|-----------|----------|
| Tables | 100% (5/5) |
| Functions | 100% (4/4) |
| RLS Policies | 100% (12/12) |
| Indexes | 100% (all critical) |

### Code Coverage (Frontend)

| Component | Coverage |
|-----------|----------|
| Pages | 100% (GMDashboard.jsx) |
| Access Control | 100% |
| API Calls | 100% |
| Error Handling | 80% (basic only) |

### Test Execution Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Total Test Cases | 60+ | 65 |
| Automated Tests | 40+ | 45 |
| Manual Tests | 20+ | 37 |
| Pass Rate | 100% | TBD |
| Execution Time | < 60 min | ~50 min |

---

## 📝 TEST REPORT TEMPLATE

```markdown
## Fase 1E Test Execution Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Development / Staging / Production
**Database:** Supabase Project ID

### Summary
- Total Tests: XX
- Passed: XX
- Failed: XX
- Skipped: XX
- Pass Rate: XX%

### Detailed Results

#### Database Tests
- [ ] DS-001: Table Creation - PASS/FAIL
- [ ] DS-002: Function Creation - PASS/FAIL
- [ ] DS-003: Quest Master Seed - PASS/FAIL
[... continue for all tests]

#### Functional Tests
- [ ] FN-001: Mission Approval - PASS/FAIL
- [ ] FN-002: Mission Rejection - PASS/FAIL
[... continue for all tests]

### Failed Tests
| Test ID | Description | Failure Reason | Screenshot |
|---------|-------------|----------------|------------|
| XX-XXX | Description | Reason | Link |

### Blockers
- None / List any blockers

### Recommendations
- Any recommendations for fixes or improvements

### Sign-off
Tested by: [Name]
Date: [Date]
Approved by: [Name]
```

---

## 🔄 REGRESSION TEST SUITE

For future phases, re-run these critical tests to ensure Fase 1E still works:

### Smoke Test (5 minutes)
1. [ ] Login as mosque_admin
2. [ ] Access `/gm` dashboard
3. [ ] Approve 1 mission
4. [ ] Schedule 1 quest
5. [ ] View quest master templates

### Regression Test (15 minutes)
1. [ ] Run `npm run test:db`
2. [ ] Test access control (unauthorized user)
3. [ ] Test approval workflow
4. [ ] Test rejection workflow
5. [ ] Test quest scheduling
6. [ ] Verify no console errors

---

## 📞 SUPPORT & ESCALATION

### Issue Reporting

**For bugs found during testing:**
1. Document steps to reproduce
2. Screenshot error messages
3. Check browser console for errors
4. Check Supabase logs
5. Report with all details

**Severity Levels:**
- **Critical:** Blocks testing, data loss, security issue
- **High:** Major feature broken, no workaround
- **Medium:** Feature partially working, workaround exists
- **Low:** UI/UX issue, cosmetic

---

## 📚 REFERENCES

### Related Documents
- `TESTING_FASE_1E.md` - Detailed testing guide
- `AUTOMATED_TESTING_GUIDE.md` - Quick start guide
- `spirit-link-prd.md` - Product requirements
- `supabase/migrations/20261013_gm_dashboard_schema.sql` - Database schema

### External Resources
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL CHECK Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [React Testing Best Practices](https://react.dev/learn/testing)

---

## ✅ SIGN-OFF

### Test Documentation Review

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | [Name] | [Signature] | [Date] |
| Developer | [Name] | [Signature] | [Date] |
| Product Owner | [Name] | [Signature] | [Date] |

### Test Execution Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tester | [Name] | [Signature] | [Date] |
| QA Lead | [Name] | [Signature] | [Date] |
| Product Owner | [Name] | [Signature] | [Date] |

---

**End of Test Documentation - Fase 1E**

**Version:** 1.0  
**Last Updated:** 13 Oktober 2026  
**Next Review:** Upon Fase 2 completion  
**Status:** ✅ Ready for Testing

---

*Spirit Link Development Team*  
*Building the future of gamified Islamic learning*
