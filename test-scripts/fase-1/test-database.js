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
console.log('🧪 FASE 1E DATABASE TESTS');
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

console.log('--- TEST 1: Database Tables ---');
await runTest('user_roles table exists', async () => {
  const { data, error } = await supabase.from('user_roles').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('quest_master table exists', async () => {
  const { data, error } = await supabase.from('quest_master').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('dungeon_quests table exists', async () => {
  const { data, error } = await supabase.from('dungeon_quests').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('mission_submissions table exists', async () => {
  const { data, error } = await supabase.from('mission_submissions').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

await runTest('dungeon_admins table exists', async () => {
  const { data, error } = await supabase.from('dungeon_admins').select('*').limit(0);
  return { pass: !error, message: error?.message };
});

console.log('\n--- TEST 2: Quest Master Seed Data ---');
await runTest('Quest master has 10 templates', async () => {
  const { data, error } = await supabase.from('quest_master').select('id');
  if (error) return { pass: false, message: error.message };
  return { pass: data.length === 10, message: `Found ${data.length} templates` };
});

await runTest('All quest templates are active', async () => {
  const { data, error } = await supabase.from('quest_master').select('is_active');
  if (error) return { pass: false, message: error.message };
  const allActive = data.every(q => q.is_active);
  return { pass: allActive, message: allActive ? 'All active' : 'Some inactive' };
});

console.log('\n--- TEST 3: Available Test Data ---');
const { data: users } = await supabase.auth.admin.listUsers();
console.log(`   Users available: ${users?.users?.length || 0}`);

const { data: dungeons } = await supabase.from('dungeons').select('id, name');
console.log(`   Dungeons available: ${dungeons?.length || 0}`);
if (dungeons?.length > 0) {
  console.log(`   Example: ${dungeons[0].name} (${dungeons[0].id})`);
}

const { data: players } = await supabase.from('players').select('id, hero_name');
console.log(`   Players available: ${players?.length || 0}`);
if (players?.length > 0) {
  console.log(`   Example: ${players[0].hero_name} (${players[0].id})`);
}

console.log('\n--- TEST 4: Existing Test Setup ---');
const { data: roles } = await supabase.from('user_roles').select('*');
console.log(`   User roles: ${roles?.length || 0}`);

const { data: admins } = await supabase.from('dungeon_admins').select('*');
console.log(`   Dungeon admins: ${admins?.length || 0}`);

const { data: dquests } = await supabase.from('dungeon_quests').select('*');
console.log(`   Dungeon quests: ${dquests?.length || 0}`);

const { data: submissions } = await supabase.from('mission_submissions').select('*').eq('status', 'pending');
console.log(`   Pending submissions: ${submissions?.length || 0}`);

console.log('\n=========================================');
console.log('TEST SUMMARY');
console.log('=========================================');
console.log(`✓ Passed: ${passCount}`);
console.log(`✗ Failed: ${failCount}`);

if (failCount === 0) {
  console.log('\n🎉 All database tests passed!');
  
  if (!admins?.length || !dquests?.length || !submissions?.length) {
    console.log('\n⚠️  WARNING: Test data incomplete');
    console.log('\nRun these commands in Supabase SQL Editor:');
    console.log('\n-- 1. Create user role:');
    console.log(`INSERT INTO user_roles (user_id, role) VALUES ('USER_ID', 'mosque_admin') ON CONFLICT (user_id) DO UPDATE SET role = 'mosque_admin';`);
    console.log('\n-- 2. Assign dungeon admin:');
    console.log(`INSERT INTO dungeon_admins (user_id, dungeon_id) VALUES ('USER_ID', 'DUNGEON_ID');`);
    console.log('\n-- 3. Create dungeon quest:');
    console.log(`INSERT INTO dungeon_quests (dungeon_id, quest_master_id, schedule_type, is_active) VALUES ('DUNGEON_ID', 'QUEST_MASTER_ID', 'daily', true);`);
    console.log('\n-- 4. Create mission submission:');
    console.log(`INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, notes, status) VALUES ('PLAYER_ID', 'DUNGEON_QUEST_ID', 'DUNGEON_ID', 'text', 'Test submission', 'pending');`);
  } else {
    console.log('\n✅ Test data ready for frontend testing!');
  }
  
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Check migration status.');
  process.exit(1);
}
