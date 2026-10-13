import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');

const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('=========================================');
console.log('🌐 FASE 1E FRONTEND CHECKLIST');
console.log('=========================================\n');

console.log('📋 MANUAL TESTING CHECKLIST\n');

console.log('--- ACCESS CONTROL ---');
console.log('☐ 1. Login as mosque_admin user');
console.log('☐ 2. Navigate to: http://localhost:5173/gm');
console.log('☐ 3. Dashboard opens without errors');
console.log('☐ 4. Header shows mosque name');
console.log('☐ 5. Three tabs visible: Validasi Misi, Quest Scheduling, Quest Master');
console.log('');

console.log('--- TAB 1: VALIDASI MISI ---');
console.log('☐ 6. Open "Validasi Misi" tab');
console.log('☐ 7. Pending submissions list appears');
console.log('☐ 8. Each card shows: hero name, quest title, EXP, status badge');
console.log('☐ 9. Approve and Reject buttons visible');
console.log('☐ 10. Click "Approve" button');
console.log('☐ 11. Success alert appears');
console.log('☐ 12. Submission disappears from list');
console.log('');

console.log('--- TAB 2: QUEST SCHEDULING ---');
console.log('☐ 13. Open "Quest Scheduling" tab');
console.log('☐ 14. Active quests list appears');
console.log('☐ 15. Click "+ Jadwalkan Quest" button');
console.log('☐ 16. Modal opens with quest templates');
console.log('☐ 17. Select a quest template');
console.log('☐ 18. Form shows with schedule type dropdown');
console.log('☐ 19. Select schedule type and click "Jadwalkan"');
console.log('☐ 20. Success alert appears');
console.log('☐ 21. New quest appears in active list');
console.log('');

console.log('--- TAB 3: QUEST MASTER ---');
console.log('☐ 22. Open "Quest Master" tab');
console.log('☐ 23. 10 quest templates displayed');
console.log('☐ 24. Each card shows: title, description, badges');
console.log('☐ 25. Read-only notice visible (for mosque_admin)');
console.log('');

console.log('--- NEGATIVE TESTS ---');
console.log('☐ 26. Logout and login as regular player');
console.log('☐ 27. Navigate to /gm');
console.log('☐ 28. "Access denied" message appears');
console.log('☐ 29. No tabs visible');
console.log('☐ 30. Logout completely');
console.log('☐ 31. Try to access /gm without login');
console.log('☐ 32. Redirects to /login');
console.log('');

console.log('--- ERROR CHECKING ---');
console.log('☐ 33. Open browser DevTools > Console');
console.log('☐ 34. Navigate through all tabs');
console.log('☐ 35. No console errors appear');
console.log('☐ 36. Check Supabase Dashboard > Logs');
console.log('☐ 37. No SQL errors in logs');
console.log('');

console.log('=========================================');
console.log('AUTOMATED DATA VERIFICATION');
console.log('=========================================\n');

const { data: pendingSubmissions } = await supabase
  .from('mission_submissions')
  .select(`
    id,
    status,
    notes,
    players:player_id (hero_name),
    dungeon_quests:dungeon_quest_id (
      quest_master:quest_master_id (title, exp_reward)
    )
  `)
  .eq('status', 'pending');

if (pendingSubmissions && pendingSubmissions.length > 0) {
  console.log(`✓ Found ${pendingSubmissions.length} pending submission(s) for testing`);
  console.log('\nSample submission:');
  console.log(`  Hero: ${pendingSubmissions[0].players?.hero_name || 'N/A'}`);
  console.log(`  Quest: ${pendingSubmissions[0].dungeon_quests?.quest_master?.title || 'N/A'}`);
  console.log(`  EXP: ${pendingSubmissions[0].dungeon_quests?.quest_master?.exp_reward || 'N/A'}`);
} else {
  console.log('⚠️  WARNING: No pending submissions found');
  console.log('   Create a test submission to test approval workflow');
}

const { data: activeQuests } = await supabase
  .from('dungeon_quests')
  .select('id, is_active, quest_master:quest_master_id (title)')
  .eq('is_active', true);

if (activeQuests && activeQuests.length > 0) {
  console.log(`\n✓ Found ${activeQuests.length} active dungeon quest(s)`);
} else {
  console.log('\n⚠️  WARNING: No active dungeon quests found');
  console.log('   Schedule a quest to test Quest Scheduling tab');
}

const { data: questTemplates } = await supabase
  .from('quest_master')
  .select('id, title, is_active');

if (questTemplates && questTemplates.length === 10) {
  console.log(`\n✓ All 10 quest templates ready`);
} else {
  console.log(`\n⚠️  WARNING: Expected 10 templates, found ${questTemplates?.length || 0}`);
}

console.log('\n=========================================');
console.log('NEXT STEPS');
console.log('=========================================');
console.log('1. Start dev server: npm run dev');
console.log('2. Login as mosque_admin user');
console.log('3. Navigate to: http://localhost:5173/gm');
console.log('4. Follow the checklist above');
console.log('5. Mark each item when completed');
console.log('\nWhen all items checked ✓ = FASE 1E COMPLETE!');
console.log('=========================================\n');
