-- =====================================================
-- AUTOMATED TEST SCRIPT - FASE 1E: GM DASHBOARD
-- =====================================================
-- Spirit Link Project
-- Version: 1.0
-- Date: 13 Oktober 2026
-- 
-- CARA MENJALANKAN:
-- 1. Buka Supabase Dashboard > SQL Editor
-- 2. Copy-paste script ini
-- 3. Klik "Run"
-- 4. Periksa hasil output di bawah
-- =====================================================

\echo '========================================='
\echo 'FASE 1E AUTOMATED TESTING'
\echo '========================================='
\echo ''

-- =====================================================
-- TEST 1: VERIFY DATABASE STRUCTURE
-- =====================================================
\echo '--- TEST 1: Verifying Tables ---'

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN (
    'user_roles', 'quest_master', 'dungeon_quests', 
    'mission_submissions', 'dungeon_admins'
  );
  
  IF table_count = 5 THEN
    RAISE NOTICE '✓ PASS: All 5 tables exist';
  ELSE
    RAISE WARNING '✗ FAIL: Expected 5 tables, found %', table_count;
  END IF;
END $$;

\echo ''
\echo '--- TEST 2: Verifying Functions ---'

DO $$
DECLARE
  func_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO func_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name IN (
    'approve_mission', 'reject_mission', 
    'is_dungeon_admin', 'is_super_admin'
  );
  
  IF func_count = 4 THEN
    RAISE NOTICE '✓ PASS: All 4 functions exist';
  ELSE
    RAISE WARNING '✗ FAIL: Expected 4 functions, found %', func_count;
  END IF;
END $$;

\echo ''
\echo '--- TEST 3: Verifying Quest Master Seed Data ---'

DO $$
DECLARE
  quest_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO quest_count FROM quest_master;
  
  IF quest_count = 10 THEN
    RAISE NOTICE '✓ PASS: Quest master has 10 templates';
  ELSE
    RAISE WARNING '✗ FAIL: Expected 10 quest templates, found %', quest_count;
  END IF;
END $$;

\echo ''
\echo '--- TEST 4: Verifying RLS Policies ---'

DO $$
DECLARE
  tables_with_rls INTEGER;
BEGIN
  SELECT COUNT(DISTINCT tablename) INTO tables_with_rls
  FROM pg_policies 
  WHERE schemaname = 'public'
  AND tablename IN ('user_roles', 'quest_master', 'dungeon_quests', 'mission_submissions', 'dungeon_admins');
  
  IF tables_with_rls = 5 THEN
    RAISE NOTICE '✓ PASS: All 5 tables have RLS policies';
  ELSE
    RAISE WARNING '✗ FAIL: Expected 5 tables with RLS, found %', tables_with_rls;
  END IF;
END $$;

-- =====================================================
-- TEST 5: DISPLAY AVAILABLE TEST DATA
-- =====================================================
\echo ''
\echo '--- TEST 5: Available Test Data ---'

\echo 'Available Users (pick one for testing):'
SELECT id, email FROM auth.users LIMIT 5;

\echo ''
\echo 'Available Dungeons (pick one for testing):'
SELECT id, name FROM dungeons LIMIT 5;

\echo ''
\echo 'Available Players (pick one for testing):'
SELECT id, hero_name FROM players LIMIT 5;

\echo ''
\echo 'Quest Master Templates:'
SELECT id, title, mission_type, exp_reward FROM quest_master ORDER BY created_at LIMIT 10;

-- =====================================================
-- INTERACTIVE SETUP SECTION
-- =====================================================
\echo ''
\echo '========================================='
\echo 'NEXT STEPS: MANUAL DATA SETUP'
\echo '========================================='
\echo 'Copy the IDs from above and run the following commands:'
\echo ''
\echo '-- 1. Create user role (replace USER_ID):'
\echo 'INSERT INTO user_roles (user_id, role) VALUES (''USER_ID'', ''mosque_admin'') ON CONFLICT (user_id) DO UPDATE SET role = ''mosque_admin'';'
\echo ''
\echo '-- 2. Assign dungeon admin (replace USER_ID and DUNGEON_ID):'
\echo 'INSERT INTO dungeon_admins (user_id, dungeon_id) VALUES (''USER_ID'', ''DUNGEON_ID'') ON CONFLICT DO NOTHING;'
\echo ''
\echo '-- 3. Create dungeon quest (replace DUNGEON_ID and QUEST_MASTER_ID):'
\echo 'INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type, is_active) VALUES (''DUNGEON_ID'', ''QUEST_MASTER_ID'', ''daily'', true);'
\echo ''
\echo '-- 4. Create mission submission (replace PLAYER_ID, DUNGEON_QUEST_ID, DUNGEON_ID):'
\echo 'INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, notes, status) VALUES (''PLAYER_ID'', ''DUNGEON_QUEST_ID'', ''DUNGEON_ID'', ''text'', ''Test submission'', ''pending'');'
\echo ''

-- =====================================================
-- TEST 6: VERIFY EXISTING TEST DATA (if already created)
-- =====================================================
\echo ''
\echo '--- TEST 6: Check Existing Test Data ---'

DO $$
DECLARE
  role_count INTEGER;
  admin_count INTEGER;
  dquest_count INTEGER;
  submission_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO role_count FROM user_roles WHERE role IN ('mosque_admin', 'super_admin');
  SELECT COUNT(*) INTO admin_count FROM dungeon_admins;
  SELECT COUNT(*) INTO dquest_count FROM dungeon_quests;
  SELECT COUNT(*) INTO submission_count FROM mission_submissions WHERE status = 'pending';
  
  RAISE NOTICE 'User Roles (admin types): %', role_count;
  RAISE NOTICE 'Dungeon Admin Assignments: %', admin_count;
  RAISE NOTICE 'Dungeon Quests Created: %', dquest_count;
  RAISE NOTICE 'Pending Submissions: %', submission_count;
  
  IF role_count > 0 AND admin_count > 0 AND dquest_count > 0 AND submission_count > 0 THEN
    RAISE NOTICE '✓ PASS: Test data ready for frontend testing';
  ELSE
    RAISE WARNING '✗ WARNING: Some test data missing. Run manual setup commands above.';
  END IF;
END $$;

-- =====================================================
-- SUMMARY
-- =====================================================
\echo ''
\echo '========================================='
\echo 'TEST SUMMARY'
\echo '========================================='
\echo 'Check the output above for:'
\echo '  ✓ PASS - Test passed successfully'
\echo '  ✗ FAIL - Test failed, needs investigation'
\echo '  ✗ WARNING - Incomplete data, manual action needed'
\echo ''
\echo 'After all database tests pass, proceed to frontend testing:'
\echo '  1. Login as mosque_admin user'
\echo '  2. Navigate to: http://localhost:5173/gm'
\echo '  3. Test all 3 tabs (Validasi Misi, Quest Scheduling, Quest Master)'
\echo '  4. Test approval/rejection workflow'
\echo ''
\echo '========================================='
