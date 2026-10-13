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
console.log('🌐 FASE 1F FRONTEND CHECKLIST');
console.log('=========================================\n');

console.log('📋 MANUAL TESTING CHECKLIST\n');

console.log('--- PREREQUISITES ---');
console.log('☐ 1. Dev server running (npm run dev)');
console.log('☐ 2. Player account exists with dungeon assigned');
console.log('☐ 3. At least 1 active dungeon quest exists');
console.log('☐ 4. Database from Fase 1E ready');
console.log('');

console.log('--- MISSIONS PAGE (/missions) ---');
console.log('☐ 5. Login as player with assigned dungeon');
console.log('☐ 6. Navigate to /missions (or click "Submit Mission" from home)');
console.log('☐ 7. Page loads without errors');
console.log('☐ 8. Active quests display correctly');
console.log('☐ 9. Each quest card shows:');
console.log('   ☐ Quest title (gold)');
console.log('   ☐ Description');
console.log('   ☐ EXP reward with icon');
console.log('   ☐ Mission type badge (cyan)');
console.log('   ☐ Parameter category badge (purple)');
console.log('   ☐ Validation method badge (yellow)');
console.log('   ☐ Schedule type badge (blue)');
console.log('   ☐ "Submit Mission" button (or "Sudah Submit" if submitted)');
console.log('☐ 10. Filter by schedule type works:');
console.log('   ☐ Click "Semua" shows all quests');
console.log('   ☐ Click "Harian" shows only daily quests');
console.log('   ☐ Click "Mingguan" shows only weekly quests');
console.log('   ☐ Click "Bulanan" shows only monthly quests');
console.log('');

console.log('--- MISSION SUBMISSION FORM ---');
console.log('☐ 11. Click "Submit Mission" button on any quest');
console.log('☐ 12. Modal opens with submission form');
console.log('☐ 13. Modal shows:');
console.log('   ☐ Quest title');
console.log('   ☐ EXP reward info box');
console.log('   ☐ Submission type selector (Text/Photo/Video)');
console.log('   ☐ Notes textarea');
console.log('   ☐ Character counter (0/500)');
console.log('   ☐ Batal button');
console.log('   ☐ Submit Mission button');
console.log('☐ 14. Test submission type switching:');
console.log('   ☐ Select "Text" - URL field hidden');
console.log('   ☐ Select "Photo" - URL field appears');
console.log('   ☐ Select "Video" - URL field appears');
console.log('☐ 15. Test validation:');
console.log('   ☐ Submit without notes - shows error');
console.log('   ☐ Submit with >500 chars notes - shows error');
console.log('   ☐ Select Photo without URL - shows error');
console.log('   ☐ Enter invalid URL format - shows error');
console.log('☐ 16. Close modal with "Batal" button - modal closes');
console.log('☐ 17. Close modal with X button - modal closes');
console.log('');

console.log('--- SUBMIT MISSION SUCCESS ---');
console.log('☐ 18. Fill form correctly:');
console.log('   ☐ Select "Text"');
console.log('   ☐ Enter notes: "Test submission untuk mission ini"');
console.log('   ☐ Click "Submit Mission"');
console.log('☐ 19. Button shows "Mengirim..." (disabled)');
console.log('☐ 20. Success alert appears: "Mission berhasil di-submit!"');
console.log('☐ 21. Modal closes automatically');
console.log('☐ 22. Quest card updates:');
console.log('   ☐ "Submit Mission" button replaced with');
console.log('   ☐ Green checkmark + "Sudah Submit Hari Ini"');
console.log('☐ 23. Cannot submit same quest again today');
console.log('');

console.log('--- SUBMIT WITH PHOTO ---');
console.log('☐ 24. Click another quest "Submit Mission"');
console.log('☐ 25. Select "Photo"');
console.log('☐ 26. Enter URL: https://placehold.co/400x300');
console.log('☐ 27. Enter notes: "Test photo submission"');
console.log('☐ 28. Click "Submit Mission"');
console.log('☐ 29. Success - submission created');
console.log('');

console.log('--- MY SUBMISSIONS PAGE (/my-submissions) ---');
console.log('☐ 30. Navigate to /my-submissions');
console.log('☐ 31. Page loads without errors');
console.log('☐ 32. Stats summary displays:');
console.log('   ☐ Pending count (yellow)');
console.log('   ☐ Approved count (green)');
console.log('   ☐ Rejected count (red)');
console.log('☐ 33. Filter buttons display with counts');
console.log('☐ 34. Submission cards display correctly:');
console.log('   ☐ Quest title');
console.log('   ☐ Submission date/time');
console.log('   ☐ Status badge');
console.log('   ☐ Notes submitted');
console.log('   ☐ Status details box');
console.log('☐ 35. For PENDING submission:');
console.log('   ☐ Yellow status badge');
console.log('   ☐ Yellow info box: "Menunggu Validasi"');
console.log('   ☐ Clock icon visible');
console.log('☐ 36. Photo proof displays as thumbnail (if applicable)');
console.log('☐ 37. Filter by status works:');
console.log('   ☐ "Semua" shows all submissions');
console.log('   ☐ "Pending" shows only pending');
console.log('   ☐ "Approved" shows only approved');
console.log('   ☐ "Rejected" shows only rejected');
console.log('');

console.log('--- APPROVED SUBMISSION (requires GM validation) ---');
console.log('☐ 38. GM approves submission via /gm dashboard');
console.log('☐ 39. Refresh /my-submissions page');
console.log('☐ 40. Approved submission shows:');
console.log('   ☐ Green status badge "Disetujui"');
console.log('   ☐ Green info box with checkmark');
console.log('   ☐ "+X EXP" displayed with gold trophy icon');
console.log('   ☐ Validation timestamp');
console.log('');

console.log('--- REJECTED SUBMISSION (requires GM rejection) ---');
console.log('☐ 41. GM rejects submission via /gm dashboard with reason');
console.log('☐ 42. Refresh /my-submissions page');
console.log('☐ 43. Rejected submission shows:');
console.log('   ☐ Red status badge "Ditolak"');
console.log('   ☐ Red info box with alert icon');
console.log('   ☐ Rejection reason displayed: "Alasan: [reason]"');
console.log('   ☐ Validation timestamp');
console.log('   ☐ No EXP awarded');
console.log('');

console.log('--- NAVIGATION & INTEGRATION ---');
console.log('☐ 44. From home page:');
console.log('   ☐ "Submit Mission" button (gold) links to /missions');
console.log('   ☐ "Lihat Submission Saya" link goes to /my-submissions');
console.log('☐ 45. From /missions page:');
console.log('   ☐ "Kembali" link returns to home');
console.log('   ☐ "Lihat Submission Saya →" link goes to /my-submissions');
console.log('☐ 46. From /my-submissions page:');
console.log('   ☐ "Kembali" link returns to home');
console.log('   ☐ "← Kembali ke Available Missions" link goes to /missions');
console.log('☐ 47. Empty state /my-submissions (no submissions):');
console.log('   ☐ Shows empty state with icon');
console.log('   ☐ "Lihat Available Missions" button visible');
console.log('');

console.log('--- RESPONSIVE DESIGN ---');
console.log('☐ 48. Test on mobile (360px width):');
console.log('   ☐ Quest cards stack vertically');
console.log('   ☐ Buttons full width');
console.log('   ☐ Modal fits screen');
console.log('   ☐ Text readable');
console.log('☐ 49. Test on tablet (768px width):');
console.log('   ☐ Layout adapts correctly');
console.log('☐ 50. Test on desktop (1024px+):');
console.log('   ☐ Content centered');
console.log('   ☐ Max width applied');
console.log('');

console.log('--- ERROR HANDLING ---');
console.log('☐ 51. Open DevTools > Console');
console.log('☐ 52. Navigate all pages - no errors');
console.log('☐ 53. Try to access /missions without login:');
console.log('   ☐ Redirects to /login');
console.log('☐ 54. Player without assigned dungeon:');
console.log('   ☐ Shows error message');
console.log('   ☐ No crash');
console.log('☐ 55. No active quests in dungeon:');
console.log('   ☐ Shows empty state message');
console.log('   ☐ No crash');
console.log('☐ 56. Image proof fails to load:');
console.log('   ☐ Shows error placeholder');
console.log('   ☐ No broken image icon');
console.log('');

console.log('--- SECURITY & RLS ---');
console.log('☐ 57. Cannot submit for inactive quest');
console.log('☐ 58. Cannot submit duplicate (same quest, same day)');
console.log('☐ 59. Cannot see other players submissions');
console.log('☐ 60. Cannot submit for quest not in player dungeon');
console.log('');

console.log('=========================================');
console.log('AUTOMATED DATA VERIFICATION');
console.log('=========================================\n');

const { data: players } = await supabase.from('players').select('id, hero_name, dungeon_id');
const playersWithDungeon = players?.filter(p => p.dungeon_id) || [];

if (playersWithDungeon.length > 0) {
  console.log(`✓ Found ${playersWithDungeon.length} player(s) with dungeon assigned`);
  console.log(`  Example: ${playersWithDungeon[0].hero_name}`);
} else {
  console.log('⚠️  WARNING: No players with dungeon assigned');
  console.log('   Assign dungeon to test player first');
}

const { data: activeQuests } = await supabase
  .from('dungeon_quests')
  .select('id, dungeon_id')
  .eq('is_active', true);

if (activeQuests && activeQuests.length > 0) {
  console.log(`\n✓ Found ${activeQuests.length} active dungeon quest(s)`);
} else {
  console.log('\n⚠️  WARNING: No active dungeon quests');
  console.log('   Create quests via GM Dashboard first');
}

const { data: submissions } = await supabase
  .from('mission_submissions')
  .select('id, status');

if (submissions && submissions.length > 0) {
  const pending = submissions.filter(s => s.status === 'pending').length;
  console.log(`\n✓ Found ${submissions.length} submission(s) (${pending} pending)`);
} else {
  console.log('\n⚠️  No submissions yet - test by submitting missions');
}

console.log('\n=========================================');
console.log('NEXT STEPS');
console.log('=========================================');
console.log('1. Ensure prerequisites ready (player + dungeon + quests)');
console.log('2. Start dev server: npm run dev');
console.log('3. Login as player with assigned dungeon');
console.log('4. Follow checklist above (60 items)');
console.log('5. Mark each item when completed');
console.log('\nWhen all items checked ✓ = FASE 1F COMPLETE!');
console.log('=========================================\n');
