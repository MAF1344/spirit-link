import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');

const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('=========================================');
console.log('🧪 FASE 1F DATABASE TESTS');
console.log('=========================================\n');

let passCount = 0;
let failCount = 0;

async function runTest(name, testFn) {
  try {
    const result = await testFn();
    if (result.pass) {
      console.log(`✓ PASS: ${name}`);
      passCount++;
    } else {
      console.log(`✗ FAIL: ${name} - ${result.message}`);
      failCount++;
    }
  } catch (error) {
    console.log(`✗ ERROR: ${name} - ${error.message}`);
    failCount++;
  }
}

console.log('--- TEST 1: Database Schema (from Fase 1E) ---');
await runTest('mission_submissions table exists', async () => {
  const { data, error } = await supabase.from('mission_submissions').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('dungeon_quests table exists', async () => {
  const { data, error } = await supabase.from('dungeon_quests').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('quest_master table exists', async () => {
  const { data, error } = await supabase.from('quest_master').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

console.log('\n--- TEST 2: Quest Master Data ---');
await runTest('Quest master has templates', async () => {
  const { data, error } = await supabase.from('quest_master').select('id');
  if (error) return { pass: false, message: error.message };
  return { pass: data.length >= 10, message: `Found ${data.length} templates` };
});

console.log('\n--- TEST 3: Player Data ---');
const { data: players } = await supabase.from('players').select('id, hero_name, dungeon_id');
console.log(`   Players available: ${players?.length || 0}`);
if (players && players.length > 0) {
  const playersWithDungeon = players.filter(p => p.dungeon_id !== null);
  console.log(`   Players with dungeon assigned: ${playersWithDungeon.length}`);
  
  if (playersWithDungeon.length > 0) {
    console.log(`   Example: ${playersWithDungeon[0].hero_name} (dungeon: ${playersWithDungeon[0].dungeon_id})`);
  }
}

console.log('\n--- TEST 4: Dungeon Quests ---');
const { data: dungeonQuests } = await supabase.from('dungeon_quests').select('id, dungeon_id, is_active');
console.log(`   Total dungeon quests: ${dungeonQuests?.length || 0}`);
const activeQuests = dungeonQuests?.filter(q => q.is_active) || [];
console.log(`   Active quests: ${activeQuests.length}`);

console.log('\n--- TEST 5: Mission Submissions ---');
const { data: submissions } = await supabase.from('mission_submissions').select('id, status');
console.log(`   Total submissions: ${submissions?.length || 0}`);
if (submissions && submissions.length > 0) {
  const pending = submissions.filter(s => s.status === 'pending').length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;
  console.log(`   Pending: ${pending}, Approved: ${approved}, Rejected: ${rejected}`);
}

console.log('\n--- TEST 6: RLS Policies Test (Player Read Access) ---');
await runTest('Player can query own submissions', async () => {
  // This will work if RLS policies are correct
  const { data, error } = await supabase
    .from('mission_submissions')
    .select('id')
    .limit(1);
  return { pass: !error, message: error ? error.message : 'Query successful' };
});

await runTest('Player can query active dungeon quests', async () => {
  const { data, error } = await supabase
    .from('dungeon_quests')
    .select('id, quest_master:quest_master_id(title)')
    .eq('is_active', true)
    .limit(1);
  return { pass: !error, message: error ? error.message : 'Query successful' };
});

console.log('\n=========================================');
console.log('TEST SUMMARY');
console.log('=========================================');
console.log(`✓ Passed: ${passCount}`);
console.log(`✗ Failed: ${failCount}`);

if (failCount === 0) {
  console.log('\n🎉 All database tests passed!');
  
  if (!players || players.length === 0) {
    console.log('\n⚠️  WARNING: No players found');
    console.log('   Create test player first');
  } else if (!players.some(p => p.dungeon_id)) {
    console.log('\n⚠️  WARNING: No players assigned to dungeons');
    console.log('   Assign player to dungeon:');
    console.log(`   UPDATE players SET dungeon_id = 'YOUR_DUNGEON_ID' WHERE id = 'PLAYER_ID';`);
  } else if (activeQuests.length === 0) {
    console.log('\n⚠️  WARNING: No active dungeon quests');
    console.log('   Create dungeon quest via GM Dashboard or run Fase 1E test data setup');
  } else {
    console.log('\n✅ All prerequisites ready for Fase 1F testing!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Login as player with assigned dungeon');
    console.log('3. Navigate to /missions');
    console.log('4. Test mission submission workflow');
  }
  
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Check database setup.');
  process.exit(1);
}
