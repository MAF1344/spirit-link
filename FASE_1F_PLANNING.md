# FASE 1F: PLAYER MISSION SUBMISSION INTERFACE

**Spirit Link Project**  
**Version:** 1.0  
**Date:** 13 Oktober 2026  
**Phase:** Fase 1F - Player Mission Submission

---

## 📋 OVERVIEW

Fase ini melengkapi alur mission workflow dengan interface untuk player melakukan submission misi. Ini adalah complement dari GM Dashboard (Fase 1E) yang sudah ada.

### Objectives
1. Player dapat melihat quest yang available di dungeon mereka
2. Player dapat submit mission (text/photo proof)
3. Player dapat melihat status submission mereka (pending/approved/rejected)
4. Player dapat melihat reward yang akan didapat
5. Player dapat melihat history submissions

---

## 🎯 FEATURES

### 1. Available Quests Display
**Location:** `/missions` atau tab di homepage

**Features:**
- List quest yang aktif untuk dungeon player
- Filter by schedule_type (daily/weekly/monthly)
- Show quest details:
  - Title
  - Description
  - EXP reward
  - Mission type
  - Validation method
  - Prayer type (if applicable)
  - Status: Available / Already Submitted Today

**UI Components:**
- Quest card with SAO-style design
- EXP badge (gold)
- Mission type badge (cyan)
- "Submit Mission" button (disabled if already submitted)

---

### 2. Mission Submission Form
**Triggered by:** Click "Submit Mission" button

**Form Fields:**
- Quest title (read-only, display)
- Submission type selector:
  - Text only
  - Photo proof (URL input for now)
  - Video proof (URL input for now)
- Notes (textarea, optional)
- Proof URL (text input if photo/video selected)
- Submit button

**Validation:**
- Notes: max 500 characters
- Proof URL: valid URL format (if photo/video selected)
- Cannot submit duplicate for same quest on same day

**Behavior:**
- Modal/drawer overlay
- Show expected reward (EXP)
- Confirmation before submit
- Success feedback with animation

---

### 3. My Submissions View
**Location:** `/my-submissions` or tab

**Features:**
- List all player's submissions
- Filter by status:
  - All
  - Pending
  - Approved
  - Rejected
- Sort by date (newest first)

**Each Submission Card Shows:**
- Quest title
- Submission date/time
- Status badge (yellow=pending, green=approved, red=rejected)
- EXP awarded (if approved)
- Rejection reason (if rejected)
- Photo proof thumbnail (if applicable)
- Notes submitted

**Actions:**
- View details (expand card)
- No edit/delete (prevent fraud)

---

### 4. Submission Status Notifications
**Type:** Visual indicators

**States:**
- **Pending:** Yellow badge, "Menunggu validasi GM"
- **Approved:** Green badge, "✓ Disetujui - +X EXP"
- **Rejected:** Red badge, "✗ Ditolak - [reason]"

**Future Enhancement (not in this fase):**
- Push notifications
- Real-time updates via websocket

---

## 🗄️ DATABASE REQUIREMENTS

### Tables Needed
**Already exists from Fase 1E:**
- ✅ `mission_submissions` - stores submissions
- ✅ `dungeon_quests` - active quests per dungeon
- ✅ `quest_master` - quest templates
- ✅ `players` - player data
- ✅ `dungeons` - dungeon data

### New Columns/Changes
**None required** - schema from Fase 1E already supports this

### Queries Needed

#### 1. Get Available Quests for Player
```sql
SELECT 
  dq.id as dungeon_quest_id,
  qm.title,
  qm.description,
  qm.mission_type,
  qm.exp_reward,
  qm.parameter_category,
  qm.validation_method,
  qm.requires_proof,
  dq.prayer_type,
  dq.schedule_type,
  dq.is_active,
  -- Check if already submitted today
  EXISTS(
    SELECT 1 FROM mission_submissions ms
    WHERE ms.player_id = 'PLAYER_ID'
    AND ms.dungeon_quest_id = dq.id
    AND DATE(ms.submitted_at) = CURRENT_DATE
  ) as submitted_today
FROM dungeon_quests dq
JOIN quest_master qm ON dq.quest_master_id = qm.id
WHERE dq.dungeon_id = 'PLAYER_DUNGEON_ID'
AND dq.is_active = true
ORDER BY qm.exp_reward DESC;
```

#### 2. Submit Mission
```sql
INSERT INTO mission_submissions (
  player_id,
  dungeon_quest_id,
  dungeon_id,
  submission_type,
  proof_url,
  notes,
  status
) VALUES (
  'PLAYER_ID',
  'DUNGEON_QUEST_ID',
  'DUNGEON_ID',
  'photo',
  'https://example.com/proof.jpg',
  'Submission notes here',
  'pending'
);
```

#### 3. Get Player Submissions
```sql
SELECT 
  ms.id,
  ms.submission_type,
  ms.proof_url,
  ms.notes,
  ms.status,
  ms.validated_at,
  ms.rejection_reason,
  ms.exp_awarded,
  ms.submitted_at,
  qm.title as quest_title,
  qm.exp_reward,
  qm.mission_type
FROM mission_submissions ms
JOIN dungeon_quests dq ON ms.dungeon_quest_id = dq.id
JOIN quest_master qm ON dq.quest_master_id = qm.id
WHERE ms.player_id = 'PLAYER_ID'
ORDER BY ms.submitted_at DESC;
```

---

## 🎨 UI/UX DESIGN

### Color Scheme (SAO-inspired)
- **Background:** Dark (#0a0a0a, #1a1a1a)
- **Accent Primary:** Electric Cyan (#00d9ff)
- **Accent Secondary:** Radiant Gold (#ffd700)
- **Success:** Green (#22c55e)
- **Warning:** Yellow (#eab308)
- **Error:** Red (#ef4444)
- **Text Primary:** White (#ffffff)
- **Text Secondary:** Gray (#a3a3a3)

### Components Styling
- Cards: Dark background with cyan border glow
- Buttons: Gradient with hover effects
- Badges: Rounded with appropriate colors
- Forms: Dark input fields with cyan focus ring
- Modal: Overlay with backdrop blur

---

## 🔐 SECURITY & VALIDATION

### Frontend Validation
- Required fields check
- URL format validation
- Character limits (notes max 500 chars)
- Duplicate submission check (same quest, same day)

### Backend Security
- RLS policies already in place from Fase 1E:
  - Players can only insert own submissions
  - Players can only read own submissions
  - GM can read submissions in own dungeon
- Unique index prevents duplicate submissions per day

### Anti-Fraud Measures
- Cannot edit/delete submission after submit
- Cannot submit for inactive quests
- Cannot submit for quests not in player's dungeon
- Timestamp immutable
- All changes logged (validated_by, validated_at)

---

## 📱 RESPONSIVE DESIGN

### Mobile First (Primary)
- Single column layout
- Full-width cards
- Bottom sheet for submission form
- Touch-friendly buttons (min 44px height)
- Swipe gestures for filters

### Desktop (Secondary)
- Two-column layout (quests list + details)
- Modal for submission form
- Hover effects
- Keyboard navigation support

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Available Quests Page (2-3 hours)
- [ ] Create `/missions` route
- [ ] Create `MissionsPage.jsx` component
- [ ] Fetch active quests from Supabase
- [ ] Display quest cards with styling
- [ ] Filter by schedule_type
- [ ] Show "submitted_today" status

### Phase 2: Submission Form (2-3 hours)
- [ ] Create `SubmissionModal.jsx` component
- [ ] Build form with validation
- [ ] Handle submission to Supabase
- [ ] Success/error feedback
- [ ] Loading states

### Phase 3: My Submissions Page (2-3 hours)
- [ ] Create `/my-submissions` route
- [ ] Create `MySubmissionsPage.jsx` component
- [ ] Fetch player submissions
- [ ] Display with status badges
- [ ] Filter by status
- [ ] Show rejection reasons

### Phase 4: Integration & Polish (1-2 hours)
- [ ] Add navigation links
- [ ] Error handling
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Responsive adjustments

**Total Estimated Time:** 8-10 hours

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (Blocking)
- [ ] Player can view active quests for their dungeon
- [ ] Player can submit mission with notes
- [ ] Player can submit mission with photo URL
- [ ] Player cannot submit duplicate (same quest, same day)
- [ ] Player can view all their submissions
- [ ] Player can see submission status (pending/approved/rejected)
- [ ] Player can see rejection reason if rejected
- [ ] EXP reward displayed correctly
- [ ] No RLS violations (can't see other player's data)

### Should Have (Important)
- [ ] Filter quests by schedule type
- [ ] Filter submissions by status
- [ ] Photo proof displays as thumbnail
- [ ] Success animation on submit
- [ ] Loading states during API calls
- [ ] Empty states for no quests/submissions
- [ ] Mobile responsive layout

### Nice to Have (Enhancement)
- [ ] Real-time status updates
- [ ] Submission count per quest type
- [ ] Weekly submission statistics
- [ ] Share submission to social media
- [ ] Offline support (PWA cache)

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- Form validation logic
- URL format checker
- Duplicate submission check
- Status badge color mapping

### Integration Tests
- Submit mission workflow (end-to-end)
- Query active quests with RLS
- Query submissions with RLS
- Photo URL rendering

### Manual Tests
- Submit text-only mission
- Submit mission with photo proof
- Try to submit duplicate (should fail)
- Try to submit for other dungeon's quest (should fail via RLS)
- View pending submission
- View approved submission (check EXP)
- View rejected submission (check reason)
- Filter functionality
- Mobile responsive layout

---

## 🐛 KNOWN LIMITATIONS

### Current Phase Limitations
1. **No photo upload** - Manual URL input only (upload in Fase 2+)
2. **No real-time updates** - Must refresh to see status changes
3. **No notifications** - No push/email alerts when validated
4. **No edit/resubmit** - Cannot modify after submit
5. **No bulk submission** - One quest at a time
6. **No submission drafts** - Must complete in one session

### Future Enhancements (Post Fase 1F)
- Supabase Storage integration for photo upload
- Real-time subscription for status updates
- Push notifications via service worker
- Submission history analytics
- Weekly submission reports
- Gamification: Submission streaks

---

## 📊 SUCCESS METRICS

### Functional Metrics
- [ ] 100% of active quests visible to player
- [ ] 0 RLS violations
- [ ] <2s page load time
- [ ] <1s submission response time
- [ ] 0 duplicate submissions in database

### User Experience Metrics
- [ ] Clear submission flow (max 3 clicks)
- [ ] Visual feedback within 200ms
- [ ] Mobile usable on 360px width
- [ ] No console errors

---

## 🔗 DEPENDENCIES

### From Fase 1E
- ✅ Database schema (mission_submissions table)
- ✅ RLS policies
- ✅ Quest master templates
- ✅ Dungeon quests scheduling

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
│   ├── MissionsPage.jsx           # Available quests list
│   └── MySubmissionsPage.jsx      # Player's submission history
├── components/
│   ├── QuestCard.jsx               # Quest display card
│   ├── SubmissionModal.jsx         # Submission form modal
│   ├── SubmissionCard.jsx          # Submission display card
│   └── StatusBadge.jsx             # Status indicator component
├── lib/
│   └── supabase.js                 # Already exists
└── App.jsx                         # Add new routes
```

---

## 🚦 IMPLEMENTATION STATUS

- [ ] Planning & Documentation ✅ (This document)
- [ ] Database Schema Review
- [ ] UI Components Development
- [ ] Page Implementation
- [ ] Integration & Testing
- [ ] Documentation Update

---

**Next Steps:**
1. Review existing player authentication flow
2. Check player-dungeon association logic
3. Implement MissionsPage component
4. Implement SubmissionModal component
5. Implement MySubmissionsPage component
6. Testing & refinement

---

**End of Fase 1F Planning Document**

*Ready for implementation - 13 Oktober 2026*
