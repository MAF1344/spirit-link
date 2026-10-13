# TEST DOCUMENTATION - FASE 1F: PLAYER MISSION SUBMISSION

**Spirit Link Project**  
**Version:** 1.0  
**Date:** 13 Oktober 2026  
**Phase:** Fase 1F - Player Mission Submission Interface  
**Status:** ✅ Ready for Testing

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Test Strategy](#test-strategy)
3. [Test Artifacts](#test-artifacts)
4. [Prerequisites](#prerequisites)
5. [Functional Tests](#functional-tests)
6. [UI/UX Tests](#uiux-tests)
7. [Integration Tests](#integration-tests)
8. [Security Tests](#security-tests)
9. [Performance Tests](#performance-tests)
10. [Test Data Requirements](#test-data-requirements)
11. [Known Issues & Limitations](#known-issues--limitations)
12. [Test Execution Guide](#test-execution-guide)
13. [Success Criteria](#success-criteria)

---

## 📖 OVERVIEW

### Purpose
Fase 1F melengkapi alur mission workflow dengan interface untuk player melakukan submission misi. Ini adalah complement dari GM Dashboard (Fase 1E).

### Features Implemented
1. **Missions Page** - Display available quests for player's dungeon
2. **Mission Submission Form** - Submit mission with text/photo/video proof
3. **My Submissions Page** - View submission history and status
4. **Status Tracking** - Real-time pending/approved/rejected status

### Scope
- Available quests display with filtering
- Mission submission workflow (text/photo/video)
- Submission history with status badges
- Integration with Fase 1E (GM validation flow)
- Responsive mobile-first design

### Out of Scope (Future Enhancements)
- Photo upload to Supabase Storage (manual URL input only)
- Real-time status updates via websockets
- Push notifications
- Submission edit/delete
- Bulk submission
- Submission drafts
- Weekly submission reports

---

## 🎯 TEST STRATEGY

### Test Levels

| Level | Type | Coverage | Execution |
|-------|------|----------|-----------|
| L1 | Database Integration | Queries, RLS policies | Automated |
| L2 | Component Rendering | React components | Manual |
| L3 | Form Validation | Input validation logic | Manual |
| L4 | Workflow | End-to-end user flows | Manual |
| L5 | UI/UX | Responsive design, accessibility | Manual |
| L6 | Security | RLS, authorization | Manual |

### Test Approach
- **Automated Tests:** Database connectivity, data availability
- **Manual Tests:** UI workflows, user interactions, visual verification
- **Integration Tests:** Connection with Fase 1E (GM validation)

---

## 📦 TEST ARTIFACTS

### Test Scripts

| File | Purpose | Command |
|------|---------|---------|
| `test-scripts/fase-1f/test-database.js` | Database integration tests | `npm run test:fase1f:db` |
| `test-scripts/fase-1f/test-frontend.js` | Frontend checklist (60 items) | `npm run test:fase1f:frontend` |

### Implementation Files

| Component | File Path |
|-----------|-----------|
| Missions Page | `src/pages/MissionsPage.jsx` |
| My Submissions Page | `src/pages/MySubmissionsPage.jsx` |
| Quest Card | `src/components/QuestCard.jsx` |
| Submission Modal | `src/components/SubmissionModal.jsx` |
| Submission Card | `src/components/SubmissionCard.jsx` |
| Status Badge | `src/components/StatusBadge.jsx` |
| App Routes | `src/App.jsx` (updated) |
| Home Page | `src/pages/Home.jsx` (updated) |

---

## ✅ PREREQUISITES

### Database Requirements (from Fase 1E)
- [x] `mission_submissions` table exists
- [x] `dungeon_quests` table exists
- [x] `quest_master` table exists (with 10 templates)
- [x] RLS policies active
- [x] Helper functions (approve_mission, reject_mission)

### Test Data Requirements
| Entity | Requirement |
|--------|-------------|
| Players | At least 1 player with `dungeon_id` assigned |
| Dungeons | At least 1 dungeon exists |
| Dungeon Quests | At least 2 active quests in player's dungeon |
| Quest Master | 10 templates (seeded in Fase 1E) |

### Setup Test Data
```sql
-- 1. Assign player to dungeon
UPDATE players 
SET dungeon_id = 'YOUR_DUNGEON_ID' 
WHERE id = 'YOUR_PLAYER_ID';

-- 2. Verify active quests exist
SELECT dq.id, qm.title 
FROM dungeon_quests dq
JOIN quest_master qm ON dq.quest_master_id = qm.id
WHERE dq.dungeon_id = 'YOUR_DUNGEON_ID'
AND dq.is_active = true;
```

### Environment Setup
- [x] Node.js installed
- [x] `npm install` completed
- [x] `.env.local` configured
- [x] Dev server runnable (`npm run dev`)

---

## 🧪 FUNCTIONAL TESTS

### Test Case FN-1F-001: View Available Quests

**Objective:** Player dapat melihat quest yang tersedia untuk dungeon mereka

**Prerequisites:**
- Player logged in
- Player has `dungeon_id` assigned
- At least 1 active quest in dungeon

**Test Steps:**
1. Login as player
2. Click "Submit Mission" button from home
3. Verify redirect to `/missions`
4. Verify page loads successfully

**Expected Result:**
- [x] Page displays without errors
- [x] Active quests from player's dungeon displayed
- [x] Each quest card shows:
  - Title (gold color)
  - Description
  - EXP reward with icon
  - Mission type badge (cyan)
  - Parameter category badge (purple)
  - Validation method badge (yellow)
  - Schedule type badge (blue)
  - "Submit Mission" button

**Success Criteria:** ✅ All active quests visible with complete information

---

### Test Case FN-1F-002: Filter Quests by Schedule Type

**Objective:** Player dapat filter quest berdasarkan schedule type

**Test Steps:**
1. Navigate to `/missions`
2. Note total quests displayed
3. Click "Harian" filter button
4. Verify only daily quests shown
5. Click "Mingguan" filter button
6. Verify only weekly quests shown
7. Click "Bulanan" filter button
8. Verify only monthly quests shown
9. Click "Semua" filter button
10. Verify all quests shown again

**Expected Result:**
- [x] Filter buttons change appearance when selected (cyan background)
- [x] Quest list updates based on filter
- [x] Correct quests displayed per filter
- [x] "Semua" shows all quests

**Success Criteria:** ✅ Filtering works correctly for all schedule types

---

### Test Case FN-1F-003: Open Submission Modal

**Objective:** Modal submission terbuka dengan data quest yang benar

**Test Steps:**
1. Navigate to `/missions`
2. Click "Submit Mission" on any quest
3. Verify modal opens

**Expected Result:**
- [x] Modal overlay appears with backdrop blur
- [x] Modal shows quest title
- [x] EXP reward displayed in info box
- [x] Submission type selector visible (Text/Photo/Video)
- [x] Notes textarea visible
- [x] Character counter shows "0/500"
- [x] "Batal" button visible
- [x] "Submit Mission" button visible
- [x] X close button in header

**Success Criteria:** ✅ Modal displays with all form elements

---

### Test Case FN-1F-004: Submission Type Selection

**Objective:** Verify conditional fields based on submission type

**Test Steps:**
1. Open submission modal
2. Verify "Text" selected by default
3. Verify URL field NOT visible
4. Click "Photo" button
5. Verify URL field appears with label "URL Bukti Foto *"
6. Click "Video" button
7. Verify URL field label changes to "URL Bukti Video *"
8. Click "Text" button
9. Verify URL field disappears

**Expected Result:**
- [x] Only one type selected at a time
- [x] Selected button has cyan background
- [x] Unselected buttons have white/10 background
- [x] URL field conditional on Photo/Video selection
- [x] URL field label dynamic based on type

**Success Criteria:** ✅ Submission type selection works correctly

---

### Test Case FN-1F-005: Form Validation - Empty Notes

**Objective:** Verify validation prevents empty notes

**Test Steps:**
1. Open submission modal
2. Leave notes empty
3. Click "Submit Mission"

**Expected Result:**
- [x] Error message appears: "Notes tidak boleh kosong"
- [x] Alert icon (red) visible
- [x] Form not submitted
- [x] Modal remains open

**Success Criteria:** ✅ Empty notes validation works

---

### Test Case FN-1F-006: Form Validation - Notes Character Limit

**Objective:** Verify 500 character limit enforced

**Test Steps:**
1. Open submission modal
2. Type 500 characters in notes
3. Verify counter shows "500/500"
4. Try to type more characters
5. Verify cannot exceed 500

**Test Steps (Validation):**
6. Type 501 characters (if possible via paste)
7. Click "Submit Mission"

**Expected Result:**
- [x] Textarea maxLength prevents typing beyond 500
- [x] Character counter updates in real-time
- [x] If >500 chars, error message: "Notes maksimal 500 karakter"

**Success Criteria:** ✅ Character limit enforced

---

### Test Case FN-1F-007: Form Validation - Photo/Video Without URL

**Objective:** Verify URL required for photo/video submissions

**Test Steps:**
1. Open submission modal
2. Select "Photo"
3. Enter notes: "Test submission"
4. Leave URL field empty
5. Click "Submit Mission"

**Expected Result:**
- [x] Error message: "URL bukti wajib diisi untuk foto/video"
- [x] Red error with alert icon
- [x] Form not submitted

**Test Steps (Video):**
6. Select "Video"
7. Leave URL empty
8. Click "Submit Mission"

**Expected Result:**
- [x] Same error for video type

**Success Criteria:** ✅ URL validation for photo/video works

---

### Test Case FN-1F-008: Form Validation - Invalid URL Format

**Objective:** Verify URL format validation

**Test Steps:**
1. Open submission modal
2. Select "Photo"
3. Enter notes: "Test"
4. Enter URL: "not-a-valid-url"
5. Click "Submit Mission"

**Expected Result:**
- [x] Error message: "Format URL tidak valid"
- [x] Form not submitted

**Test Steps (Valid URL):**
6. Change URL to: "https://placehold.co/400x300"
7. Click "Submit Mission"

**Expected Result:**
- [x] No URL validation error
- [x] Form submits successfully

**Success Criteria:** ✅ URL format validation works

---

### Test Case FN-1F-009: Submit Mission - Text Only

**Objective:** Successfully submit text-only mission

**Prerequisites:**
- Player has NOT submitted this quest today

**Test Steps:**
1. Navigate to `/missions`
2. Click "Submit Mission" on a quest
3. Verify "Text" selected (default)
4. Enter notes: "Saya sudah melaksanakan sholat subuh berjamaah di masjid"
5. Click "Submit Mission" button

**Expected Result:**
- [x] Button text changes to "Mengirim..."
- [x] Button disabled during submission
- [x] Success alert appears: "Mission berhasil di-submit! Tunggu validasi dari GM."
- [x] Modal closes automatically
- [x] Page refreshes quest list
- [x] Quest card now shows green checkmark + "Sudah Submit Hari Ini"
- [x] "Submit Mission" button disabled/replaced

**Database Verification:**
```sql
SELECT * FROM mission_submissions 
WHERE player_id = 'PLAYER_ID' 
AND dungeon_quest_id = 'QUEST_ID'
AND DATE(submitted_at) = CURRENT_DATE;

-- Expected: 1 row with status='pending', submission_type='text'
```

**Success Criteria:** ✅ Text submission created successfully

---

### Test Case FN-1F-010: Submit Mission - With Photo

**Objective:** Successfully submit mission with photo proof

**Test Steps:**
1. Navigate to `/missions`
2. Click "Submit Mission" on another quest
3. Select "Photo"
4. Enter URL: `https://placehold.co/400x300`
5. Enter notes: "Foto bukti kehadiran sholat"
6. Click "Submit Mission"

**Expected Result:**
- [x] Submission successful
- [x] Success alert appears
- [x] Modal closes
- [x] Quest marked as submitted

**Database Verification:**
```sql
SELECT submission_type, proof_url, notes, status 
FROM mission_submissions 
WHERE id = 'LATEST_SUBMISSION_ID';

-- Expected: submission_type='photo', proof_url contains URL, status='pending'
```

**Success Criteria:** ✅ Photo submission with URL created

---

### Test Case FN-1F-011: Prevent Duplicate Submission

**Objective:** Verify cannot submit same quest twice in one day

**Prerequisites:**
- Already submitted a quest today (from FN-1F-009)

**Test Steps:**
1. Navigate to `/missions`
2. Find the quest submitted in FN-1F-009
3. Verify button shows green checkmark + "Sudah Submit Hari Ini"
4. Verify button is NOT clickable

**Test Steps (Attempt via direct API):**
5. Try to insert duplicate via SQL:
```sql
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, notes, status)
VALUES ('PLAYER_ID', 'QUEST_ID', 'DUNGEON_ID', 'text', 'Duplicate test', 'pending');
```

**Expected Result:**
- [x] UI prevents submission (button disabled)
- [x] Database unique index prevents duplicate
- [x] Error: unique constraint violation

**Success Criteria:** ✅ Duplicate prevention works at UI and DB level

---

### Test Case FN-1F-012: View My Submissions - Initial Load

**Objective:** Player dapat melihat semua submission mereka

**Test Steps:**
1. Click "Lihat Submission Saya" from missions page
2. Verify redirect to `/my-submissions`
3. Verify page loads successfully

**Expected Result:**
- [x] Page displays without errors
- [x] Stats summary shows:
  - Pending count (yellow box)
  - Approved count (green box)
  - Rejected count (red box)
- [x] Filter buttons visible with counts
- [x] Submission cards displayed (newest first)
- [x] Each card shows:
  - Quest title
  - Submission date/time
  - Status badge
  - Notes submitted
  - Status details box

**Success Criteria:** ✅ All submissions visible with correct information

---

### Test Case FN-1F-013: Submission Card - Pending Status

**Objective:** Verify pending submission displays correctly

**Test Steps:**
1. View `/my-submissions`
2. Find a pending submission
3. Verify card details

**Expected Result:**
- [x] Status badge: Yellow with "Pending"
- [x] Yellow info box with clock icon
- [x] Text: "Menunggu Validasi"
- [x] Subtext: "GM sedang mereview submission kamu"
- [x] No EXP displayed
- [x] No validation timestamp

**Success Criteria:** ✅ Pending status displayed correctly

---

### Test Case FN-1F-014: Submission Card - Photo Display

**Objective:** Verify photo proof displays correctly

**Test Steps:**
1. View `/my-submissions`
2. Find submission with photo (from FN-1F-010)
3. Verify photo thumbnail

**Expected Result:**
- [x] Image displays from proof_url
- [x] Max height: 192px (max-h-48)
- [x] Border: white/10
- [x] Rounded corners
- [x] Object-cover to maintain aspect ratio

**Test Steps (Image Load Failure):**
4. Create submission with invalid URL
5. Verify fallback error state

**Expected Result:**
- [x] Error placeholder displays
- [x] Red border with alert icon
- [x] Text: "Gagal memuat gambar"
- [x] No broken image icon

**Success Criteria:** ✅ Photo display and error handling works

---

### Test Case FN-1F-015: Filter Submissions by Status

**Objective:** Verify status filtering works correctly

**Test Steps:**
1. Navigate to `/my-submissions`
2. Note total submissions
3. Click "Pending" filter
4. Verify only pending submissions shown
5. Click "Approved" filter
6. Verify only approved submissions shown (if any)
7. Click "Rejected" filter
8. Verify only rejected submissions shown (if any)
9. Click "Semua" filter
10. Verify all submissions shown

**Expected Result:**
- [x] Filter button active state (cyan background)
- [x] Count in parentheses matches displayed items
- [x] Correct submissions filtered
- [x] Empty state if no items for filter

**Success Criteria:** ✅ Status filtering works correctly

---

### Test Case FN-1F-016: GM Approves Submission

**Objective:** Verify approved submission displays correctly

**Prerequisites:**
- At least 1 pending submission exists
- GM user has access to /gm dashboard

**Test Steps:**
1. Login as GM (Fase 1E account)
2. Navigate to `/gm`
3. Open "Validasi Misi" tab
4. Find player's submission
5. Click "Approve" button
6. Verify success alert

**Test Steps (Player Side):**
7. Logout GM, login as player
8. Navigate to `/my-submissions`
9. Find the approved submission

**Expected Result:**
- [x] Status badge: Green with "Disetujui"
- [x] Green info box with checkmark icon
- [x] Text: "Mission Disetujui!"
- [x] EXP displayed: "+X EXP" with gold trophy icon
- [x] Validation timestamp displayed
- [x] Stats summary updated (pending -1, approved +1)

**Database Verification:**
```sql
SELECT status, exp_awarded, validated_at, validated_by
FROM mission_submissions
WHERE id = 'SUBMISSION_ID';

-- Expected: status='approved', exp_awarded>0, validated_at NOT NULL
```

**Success Criteria:** ✅ Approved submission displays correctly with EXP

---

### Test Case FN-1F-017: GM Rejects Submission

**Objective:** Verify rejected submission displays correctly

**Prerequisites:**
- At least 1 pending submission exists

**Test Steps (GM Side):**
1. Login as GM
2. Navigate to `/gm` > "Validasi Misi"
3. Click "Reject" on a submission
4. Enter reason: "Foto tidak jelas, submit ulang dengan foto lebih baik"
5. Click OK
6. Verify success alert

**Test Steps (Player Side):**
7. Logout GM, login as player
8. Navigate to `/my-submissions`
9. Find the rejected submission

**Expected Result:**
- [x] Status badge: Red with "Ditolak"
- [x] Red info box with alert icon
- [x] Text: "Mission Ditolak"
- [x] Rejection reason displayed: "Alasan: Foto tidak jelas..."
- [x] Validation timestamp displayed
- [x] No EXP displayed
- [x] Stats summary updated (pending -1, rejected +1)

**Database Verification:**
```sql
SELECT status, rejection_reason, exp_awarded, validated_at
FROM mission_submissions
WHERE id = 'SUBMISSION_ID';

-- Expected: status='rejected', rejection_reason NOT NULL, exp_awarded=0
```

**Success Criteria:** ✅ Rejected submission displays with reason

---

## 🎨 UI/UX TESTS

### Test Case UI-1F-001: Responsive Design - Mobile (360px)

**Objective:** Verify mobile layout works correctly

**Test Steps:**
1. Open DevTools, set viewport to 360x640
2. Navigate to `/missions`
3. Verify layout

**Expected Result:**
- [x] Quest cards stack vertically
- [x] Full-width cards
- [x] Text readable (no overflow)
- [x] Buttons full-width
- [x] Filter buttons wrap correctly
- [x] Touch targets ≥44px height

**Test Steps (Modal):**
4. Open submission modal
5. Verify modal fits screen

**Expected Result:**
- [x] Modal max-height: 90vh
- [x] Scrollable if content exceeds
- [x] Buttons stacked (Batal / Submit)
- [x] Form fields full-width

**Test Steps (My Submissions):**
6. Navigate to `/my-submissions`
7. Verify layout

**Expected Result:**
- [x] Stats boxes in 3-column grid
- [x] Submission cards full-width
- [x] Photo thumbnails responsive

**Success Criteria:** ✅ Mobile layout usable on 360px width

---

### Test Case UI-1F-002: Responsive Design - Tablet (768px)

**Objective:** Verify tablet layout

**Test Steps:**
1. Set viewport to 768x1024
2. Navigate all pages

**Expected Result:**
- [x] Layout scales appropriately
- [x] Cards maintain readable width
- [x] Adequate spacing
- [x] Touch targets accessible

**Success Criteria:** ✅ Tablet layout works correctly

---

### Test Case UI-1F-003: Responsive Design - Desktop (1024px+)

**Objective:** Verify desktop layout

**Test Steps:**
1. Set viewport to 1920x1080
2. Navigate all pages

**Expected Result:**
- [x] Content centered
- [x] Max-width applied (prevents overstretching)
- [x] Adequate margins
- [x] Modal centered on screen
- [x] Hover effects visible on buttons/cards

**Success Criteria:** ✅ Desktop layout looks professional

---

### Test Case UI-1F-004: Color Scheme & Theming

**Objective:** Verify SAO-inspired color scheme consistent

**Visual Verification:**
- [x] Background: Dark (#0A192F)
- [x] Primary accent: Electric Cyan (#00F2FF)
- [x] Secondary accent: Radiant Gold (#FFD700)
- [x] Success: Green (#22c55e)
- [x] Warning: Yellow (#eab308)
- [x] Error: Red (#ef4444)
- [x] Card backgrounds: #1a1a1a
- [x] Borders: Cyan with glow effect

**Success Criteria:** ✅ Consistent theming across all pages

---

### Test Case UI-1F-005: Loading States

**Objective:** Verify loading indicators display

**Test Steps:**
1. Navigate to `/missions` (slow network)
2. Verify loading state

**Expected Result:**
- [x] Spinner (Loader2) with animation
- [x] Text: "Memuat missions..."
- [x] Centered on screen

**Test Steps (Submission):**
3. Submit mission
4. Verify button loading state

**Expected Result:**
- [x] Button text: "Mengirim..."
- [x] Button disabled
- [x] Cursor: not-allowed

**Success Criteria:** ✅ Loading states provide feedback

---

### Test Case UI-1F-006: Empty States

**Objective:** Verify empty state messages

**Test Steps (No Submissions):**
1. Login as new player (no submissions)
2. Navigate to `/my-submissions`

**Expected Result:**
- [x] Empty state card displayed
- [x] FileText icon (gray)
- [x] Message: "Kamu belum pernah submit mission apapun."
- [x] Button: "Lihat Available Missions"

**Test Steps (No Quests for Filter):**
3. Navigate to `/missions`
4. Click a filter with no matching quests

**Expected Result:**
- [x] Message: "Tidak ada mission tersedia untuk filter ini."
- [x] No crash or blank screen

**Success Criteria:** ✅ Empty states handle gracefully

---

### Test Case UI-1F-007: Error States

**Objective:** Verify error messages display correctly

**Test Steps (Player Without Dungeon):**
1. Set player dungeon_id to NULL
2. Navigate to `/missions`

**Expected Result:**
- [x] Red error box displayed
- [x] Message: "Kamu belum terdaftar di dungeon manapun. Hubungi admin."
- [x] Back button functional

**Test Steps (Database Error):**
3. Disconnect internet
4. Try to load missions

**Expected Result:**
- [x] Error message displayed
- [x] No app crash

**Success Criteria:** ✅ Error states handled gracefully

---

## 🔗 INTEGRATION TESTS

### Test Case IT-1F-001: End-to-End Workflow

**Objective:** Complete submission workflow from player to GM approval

**Test Steps:**
1. **Player:** Submit mission
2. **Database:** Verify submission created
3. **GM:** View submission in GM Dashboard
4. **GM:** Approve submission
5. **Database:** Verify status updated, EXP awarded
6. **Player:** View approved submission
7. **Database:** Verify player total_exp increased

**Expected Result:**
- [x] Full workflow completes without errors
- [x] Data consistency maintained
- [x] EXP correctly awarded

**Success Criteria:** ✅ End-to-end integration works

---

### Test Case IT-1F-002: RLS Policy Integration

**Objective:** Verify RLS policies from Fase 1E work with Fase 1F

**Test Scenarios:**

#### Scenario A: Player Reads Own Submissions
```javascript
// As Player A
const { data } = await supabase
  .from('mission_submissions')
  .select('*')
  .eq('player_id', playerA.id);
// Expected: Returns Player A's submissions only
```

#### Scenario B: Player Cannot Read Other's Submissions
```javascript
// As Player A, try to read Player B's submissions
const { data } = await supabase
  .from('mission_submissions')
  .select('*')
  .eq('player_id', playerB.id);
// Expected: Empty result (filtered by RLS)
```

#### Scenario C: Player Can Query Dungeon Quests
```javascript
const { data } = await supabase
  .from('dungeon_quests')
  .select('*')
  .eq('dungeon_id', player.dungeon_id)
  .eq('is_active', true);
// Expected: Returns active quests for player's dungeon
```

**Success Criteria:** ✅ RLS policies enforce correct access control

---

### Test Case IT-1F-003: Data Consistency

**Objective:** Verify data consistency between related tables

**Test Steps:**
1. Submit mission
2. Query submission with joins:
```sql
SELECT 
  ms.*,
  dq.dungeon_id,
  qm.title as quest_title,
  qm.exp_reward
FROM mission_submissions ms
JOIN dungeon_quests dq ON ms.dungeon_quest_id = dq.id
JOIN quest_master qm ON dq.quest_master_id = qm.id
WHERE ms.id = 'SUBMISSION_ID';
```

**Expected Result:**
- [x] All foreign keys resolve correctly
- [x] No orphaned records
- [x] Quest data matches submission

**Success Criteria:** ✅ Data relationships intact

---

## 🔒 SECURITY TESTS

### Test Case SC-1F-001: Authentication Required

**Objective:** Verify unauthenticated users cannot access pages

**Test Steps:**
1. Logout completely
2. Try to access `/missions`
3. Try to access `/my-submissions`

**Expected Result:**
- [x] Both pages redirect to `/login`
- [x] No data leaked
- [x] No console errors

**Success Criteria:** ✅ Authentication enforced

---

### Test Case SC-1F-002: Authorization - Own Data Only

**Objective:** Verify players can only access own submissions

**Test Steps:**
1. Login as Player A
2. Note Player A's submissions
3. Login as Player B
4. Navigate to `/my-submissions`

**Expected Result:**
- [x] Player B sees ONLY their submissions
- [x] Player A's submissions NOT visible
- [x] RLS policies enforced

**Success Criteria:** ✅ Authorization isolates player data

---

### Test Case SC-1F-003: SQL Injection Prevention

**Objective:** Verify parameterized queries prevent injection

**Test Steps:**
1. Open submission modal
2. In notes field, enter: `'; DROP TABLE mission_submissions; --`
3. Submit mission

**Expected Result:**
- [x] Submission created normally
- [x] Notes saved as plain text
- [x] No SQL execution
- [x] Table still exists

**Success Criteria:** ✅ SQL injection prevented

---

### Test Case SC-1F-004: XSS Prevention

**Objective:** Verify HTML/JS injection prevented

**Test Steps:**
1. Submit mission with notes: `<script>alert('XSS')</script>`
2. View submission in My Submissions page

**Expected Result:**
- [x] Script does NOT execute
- [x] Text displayed as plain text
- [x] HTML entities escaped

**Success Criteria:** ✅ XSS prevented via React's built-in protection

---

### Test Case SC-1F-005: Cross-Dungeon Isolation

**Objective:** Verify players cannot submit to other dungeon's quests

**Test Steps:**
1. Login as Player A (dungeon X)
2. Get quest_id from Dungeon Y
3. Try to submit via API:
```javascript
await supabase.from('mission_submissions').insert({
  player_id: playerA.id,
  dungeon_quest_id: 'quest-from-dungeon-y',
  dungeon_id: 'dungeon-y-id',
  submission_type: 'text',
  notes: 'Attempting cross-dungeon submission',
  status: 'pending'
});
```

**Expected Result:**
- [x] Insert may succeed (no FK constraint on dungeon match)
- [x] BUT: GM from Dungeon Y cannot see it (RLS filtered)
- [x] Player cannot submit via UI (quest not in list)

**Recommendation:** Add CHECK constraint or trigger to enforce dungeon_id match

**Success Criteria:** ✅ UI prevents cross-dungeon submissions

---

## 📊 PERFORMANCE TESTS

### Test Case PF-1F-001: Page Load Time

**Objective:** Verify pages load within acceptable time

**Test Metrics:**

| Page | Target Load Time | Measurement |
|------|------------------|-------------|
| /missions | < 2s | TBD |
| /my-submissions | < 2s | TBD |
| Modal open | < 200ms | TBD |

**Test Steps:**
1. Open DevTools > Network tab
2. Clear cache
3. Navigate to `/missions`
4. Measure load time

**Success Criteria:** ✅ All pages load < 2s on 3G connection

---

### Test Case PF-1F-002: Large Dataset Handling

**Objective:** Verify performance with many submissions

**Test Setup:**
```sql
-- Insert 50 test submissions
INSERT INTO mission_submissions (player_id, dungeon_quest_id, dungeon_id, submission_type, notes, status)
SELECT 
  'PLAYER_ID',
  dq.id,
  'DUNGEON_ID',
  'text',
  'Test submission ' || i,
  'pending'
FROM generate_series(1, 50) i
CROSS JOIN (SELECT id FROM dungeon_quests LIMIT 1) dq;
```

**Test Steps:**
1. Navigate to `/my-submissions`
2. Measure page load time
3. Test scrolling performance

**Expected Result:**
- [x] Page loads < 3s
- [x] Smooth scrolling (60fps)
- [x] No UI lag

**Note:** Pagination needed if > 50 submissions (see Limitations)

**Success Criteria:** ✅ Handles 50 submissions without lag

---

## 📋 TEST DATA REQUIREMENTS

### Minimum Test Data

| Entity | Quantity | Notes |
|--------|----------|-------|
| Players | 2 | 1 with dungeon, 1 without |
| Dungeons | 1 | Any active dungeon |
| Active Dungeon Quests | 3 | Daily, weekly, monthly |
| Quest Master Templates | 10 | From Fase 1E seed |
| Mission Submissions | 5 | 2 pending, 2 approved, 1 rejected |

### Test Data Setup Script

```sql
-- 1. Assign player to dungeon
UPDATE players 
SET dungeon_id = (SELECT id FROM dungeons LIMIT 1)
WHERE id = 'YOUR_PLAYER_ID';

-- 2. Verify active quests exist (or create via GM Dashboard)
SELECT COUNT(*) FROM dungeon_quests 
WHERE dungeon_id = (SELECT dungeon_id FROM players WHERE id = 'YOUR_PLAYER_ID')
AND is_active = true;
-- Expected: At least 3

-- 3. Create test submissions (run after submitting via UI)
-- Approve 2 submissions via GM Dashboard
-- Reject 1 submission via GM Dashboard with reason
```

---

## ⚠️ KNOWN ISSUES & LIMITATIONS

### Current Limitations

| Issue | Impact | Workaround | Planned Fix |
|-------|--------|------------|-------------|
| No photo upload | Must use external hosting | Use imgur/imgbb | Fase 2+ (Supabase Storage) |
| No pagination | Slow with >50 submissions | Manual SQL filtering | Fase 2+ |
| No real-time updates | Must refresh to see status changes | Manual refresh button | Fase 2+ (Websockets) |
| No edit submission | Cannot fix typos after submit | Reject & resubmit | Future (with time limit) |
| No submission drafts | Must complete in one session | Keep notes in separate app | Future |
| Manual URL input | Poor UX for photo proof | Use image hosting services | Fase 2+ |
| No offline support | Requires internet connection | N/A | Future (PWA features) |

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ⚠️ Not tested |
| Edge | Latest | ✅ Supported |
| Mobile Chrome | Latest | ✅ Supported |
| Mobile Safari | Latest | ⚠️ Basic responsive only |

---

## 📖 TEST EXECUTION GUIDE

### Pre-requisites

1. Fase 1E completed and tested
2. Database schema from Fase 1E applied
3. Test data prepared (see Test Data Requirements)
4. Dev environment set up

### Execution Order

#### Phase 1: Automated Tests (5 minutes)

```bash
npm run test:fase1f:db
```

**Expected:** All database tests pass

#### Phase 2: Functional Tests (20 minutes)

Follow test cases FN-1F-001 through FN-1F-017:
- Test available quests display
- Test submission form
- Test validation
- Test successful submission
- Test my submissions page
- Test approval/rejection flow

#### Phase 3: UI/UX Tests (15 minutes)

Follow test cases UI-1F-001 through UI-1F-007:
- Test responsive design
- Test color scheme
- Test loading/empty/error states

#### Phase 4: Integration Tests (10 minutes)

Follow test cases IT-1F-001 through IT-1F-003:
- Test end-to-end workflow
- Verify RLS integration
- Check data consistency

#### Phase 5: Security Tests (10 minutes)

Follow test cases SC-1F-001 through SC-1F-005:
- Test authentication
- Test authorization
- Test injection prevention

#### Phase 6: Performance Tests (5 minutes)

Follow test cases PF-1F-001 through PF-1F-002:
- Measure load times
- Test with large datasets

**Total Estimated Time:** ~65 minutes

---

## ✅ SUCCESS CRITERIA

### Must Pass (Blocking)

- [ ] Player can view active quests for their dungeon
- [ ] Player can submit mission (text/photo/video)
- [ ] Player cannot submit duplicate (same quest, same day)
- [ ] Player can view all their submissions
- [ ] Player can see submission status (pending/approved/rejected)
- [ ] Approved submission shows EXP awarded
- [ ] Rejected submission shows rejection reason
- [ ] Filter by schedule type works
- [ ] Filter by submission status works
- [ ] RLS policies prevent cross-player data access
- [ ] Authentication required for all pages
- [ ] No console errors during normal operation
- [ ] Integration with Fase 1E GM Dashboard works

### Should Pass (Important)

- [ ] Form validation prevents invalid submissions
- [ ] Photo proof displays correctly
- [ ] Loading states visible during API calls
- [ ] Empty states display correctly
- [ ] Error messages clear and helpful
- [ ] Mobile responsive (360px width)
- [ ] Stats summary accurate
- [ ] Navigation links work correctly

### Nice to Have (Enhancement)

- [ ] Smooth animations
- [ ] Hover effects on desktop
- [ ] Image load error handling
- [ ] Character counter updates in real-time
- [ ] Submission count per status accurate

---

## 📊 TEST METRICS

### Test Coverage

| Category | Test Cases | Automated | Manual |
|----------|-----------|-----------|--------|
| Functional | 17 | 3 | 14 |
| UI/UX | 7 | 0 | 7 |
| Integration | 3 | 1 | 2 |
| Security | 5 | 0 | 5 |
| Performance | 2 | 0 | 2 |
| **Total** | **34** | **4** | **30** |

### Execution Time

- Automated tests: ~5 minutes
- Manual tests: ~60 minutes
- **Total: ~65 minutes**

---

## 📝 TEST REPORT TEMPLATE

```markdown
## Fase 1F Test Execution Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Development / Staging / Production

### Summary
- Total Tests: 34
- Passed: XX
- Failed: XX
- Skipped: XX
- Pass Rate: XX%

### Detailed Results

#### Functional Tests (17)
- [ ] FN-1F-001: View Available Quests - PASS/FAIL
- [ ] FN-1F-002: Filter Quests - PASS/FAIL
[... continue for all tests]

### Failed Tests
| Test ID | Description | Failure Reason | Screenshot |
|---------|-------------|----------------|------------|
| XX-XXX | Description | Reason | Link |

### Integration with Fase 1E
- [ ] GM can see player submissions
- [ ] Approval awards EXP correctly
- [ ] Rejection saves reason

### Performance Metrics
- /missions load time: X.XXs
- /my-submissions load time: X.XXs
- Modal open time: XXXms

### Blockers
- None / List any blockers

### Recommendations
- Any recommendations for improvements

### Sign-off
Tested by: [Name]
Date: [Date]
Approved by: [Name]
```

---

## 🔄 REGRESSION TEST SUITE

When adding future phases, re-run these critical Fase 1F tests:

### Smoke Test (5 minutes)
1. [ ] Login as player
2. [ ] View available missions
3. [ ] Submit 1 mission
4. [ ] View my submissions
5. [ ] Verify submission appears

### Regression Test (15 minutes)
1. [ ] Run `npm run test:fase1f:db`
2. [ ] Test submission workflow
3. [ ] Test filtering
4. [ ] Test status updates (with GM)
5. [ ] Verify no console errors

---

## 📞 SUPPORT & ESCALATION

### Issue Severity

- **Critical:** Cannot submit missions, data loss, security breach
- **High:** Major feature broken, no workaround
- **Medium:** Feature partially working, workaround exists
- **Low:** UI/UX issue, cosmetic

### Bug Report Template

```markdown
**Title:** Brief description
**Severity:** Critical / High / Medium / Low
**Environment:** Browser, OS, screen size
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Screenshots:**
Attach screenshots

**Console Errors:**
Paste any console errors

**Database State:**
Relevant SQL query results (if applicable)
```

---

## 📚 REFERENCES

### Related Documents
- `FASE_1F_PLANNING.md` - Implementation planning
- `dokumentasi-test-dan-verifikasi/fase-1/FASE_1E_TEST_DOCUMENTATION.md` - Fase 1E tests
- `spirit-link-prd.md` - Product requirements

### External Resources
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

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

**End of Test Documentation - Fase 1F**

**Version:** 1.0  
**Last Updated:** 13 Oktober 2026  
**Next Review:** Upon Fase 2 completion  
**Status:** ✅ Ready for Testing

---

*Spirit Link Development Team*  
*Building the future of gamified Islamic learning*
