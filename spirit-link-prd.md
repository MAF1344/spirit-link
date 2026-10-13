**SPIRIT LINK**

_Connect Your Soul, Awaken the Hero_

Software Requirements Specification

Version 1.0 | April 2026

Prepared for: Spirit Link Development Team

Region: Indonesia (Jakarta pilot)

# **1\. Executive Summary**

Spirit Link is a location-based spiritual gamification Progressive Web App (PWA) designed for Indonesian youth. Set in a near-future world called The Fallen Realm, players take on the role of Reclaimers who must physically visit mosques (Dungeons) to complete real-world missions, earn in-game rewards, and collectively push back a global Doom Meter that represents the spiritual decline of the youth.

The app is inspired by the Sword Art Online (SAO) aesthetic — a dark, futuristic HUD interface with Electric Cyan and Radiant Gold accents — and is built as a mobile-first PWA accessible from any browser without installation. The pilot launch targets 100 players across 5 mosques in Jakarta.

| **App Name**        | Spirit Link                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **Tagline**         | Connect Your Soul, Awaken the Hero                               |
| **Platform**        | Progressive Web App (PWA) — mobile-first, iOS & Android browsers |
| **Target Audience** | Indonesian youth and students (elementary school age and up)     |
| **Pilot Scale**     | 100 players, 5 mosques, Jakarta                                  |
| **Languages**       | English, Bahasa Indonesia                                        |
| **Budget**          | Under USD \$500                                                  |
| **Dev Stack**       | React + Vite, Tailwind CSS, Leaflet.js, Supabase, Node.js        |

# **2\. World & Lore**

## **2.1 Setting: The Fallen Realm**

The narrative foundation of Spirit Link is critical to its engagement design. Every UI element, mission name, and reward system must reflect this lore.

In a world dimmed by the Digital Eclipse, humanity has lost its spiritual connection, triggering the rise of The Void — a darkness that consumes the will to live.

This phenomenon caused mosques to lose their "Cahaya" (Light) and become locked as Silent Dungeons, abandoned in the midst of empty cities.

You are a Reclaimer — a chosen hero equipped with the Spirit Link system to detect and physically visit these Dungeons. By completing worship and social missions in the real world, you trigger a Pulse of Light that drives away the darkness, earning EXP and rare Loot.

The more mosques you activate, the brighter the earth's light shines — delaying the apocalypse.

## **2.2 The Doom Meter**

The Doom Meter is the central global mechanic representing the collective spiritual health of the youth. It is not just a number — it is the emotional engine of the game.

| **Starting Value**     | 100% (full light)                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Passive Decay Rate** | 0.2% per day (the expansion of The Void)                                                                                              |
| **Season Length**      | One calendar year                                                                                                                     |
| **Recovery Mechanism** | Collective player check-ins generate Light Points that push the meter up                                                              |
| **At 0%**              | Global Over state — equipment locked, requires a real-world coordinated event (e.g. city-wide Fajr gathering) to trigger a Hard Reset |

### **2.2.1 Doom Meter Stages**

| **Radiant (100%–70%)** | Bright SAO gold and cyan UI. High-energy, positive tone. Standard EXP rates.                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **Dusk (69%–40%)**     | Warm amber tones begin bleeding into the UI. Missions become slightly more urgent.                  |
| **Shadow (39%–15%)**   | Desaturated, glitchy purple overlay. UI distortion effects. EXP bonuses for active players.         |
| **Eclipse (14%–1%)**   | Full crimson-red crisis UI. Alarm-like HUD. Maximum EXP multipliers. Emergency raid events trigger. |

# **3\. User Roles & Accounts**

| **Player (Reclaimer)**        | Standard user. Registers, completes missions, earns EXP and loot, participates in leaderboards.                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Mosque Admin (Dungeon GM)** | Manages a single assigned dungeon. Schedules quests from approved templates, validates missions, manages local prize inventory. |
| **Quest Creator**             | Can create and edit quest templates in the master list. Assigned by Super-Admin.                                                |
| **Validator**                 | Can approve or reject player mission submissions. Read-only on other data.                                                      |
| **Super-Admin**               | Full system access. Manages dungeon registry, master quest list, all GM accounts, global analytics, and Hard Reset events.      |
| **Parent / Guardian**         | Read-only dashboard to monitor their child's activity and receive weekly email summaries.                                       |

# **4\. Character System**

## **4.1 Core Parameters**

Every player — regardless of class — is measured across five core spiritual parameters:

| **Mandatory Worship**         | Completion of Fardhu prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)          |
| ----------------------------- | ----------------------------------------------------------------------- |
| **Sunnah Devotion**           | Completion of recommended prayers, fasts, and Sunnah practices          |
| **Quranic Literacy**          | Quran reading, memorization, and recitation missions                    |
| **Seeker's Insight (Kajian)** | Attendance of study circles, lectures, and religious education events   |
| **Dawah Outreach**            | Community service, mosque committee participation, and digital activism |

## **4.2 Character Classes**

After initial onboarding, players choose one of four specializations. Class selection is permanent but can be reset by Super-Admin request.

| **The Quran Protector** | Specialist in Quranic Literacy. Gains 1.2x EXP multiplier on Quran missions. Bonus power for memorization streaks.              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **The Da'i**            | Vanguard of Dawah Outreach. Excels in mosque committee and digital activism missions. Unlocks unique 'Spread the Light' skills. |
| **The Scholar**         | Seeker of knowledge. Focuses on Seeker's Insight. Gains intellect-based buffs for attending study circles and lectures.         |
| **The Mu'min**          | Balanced class. No single specialization. Receives a flat +5% EXP bonus across all mission types.                               |

## **4.3 Progression System**

| **Max Level**        | 100 (per dungeon)                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| **EXP Formula**      | Exponential — EXP required doubles with each level tier to ensure early gratification and long-term challenge |
| **Daily EXP Cap**    | Yes — routine missions are capped per day to encourage consistent daily presence over irregular bursts        |
| **Class Multiplier** | 1.2x EXP when mission aligns with chosen class specialty                                                      |
| **Mu'min Bonus**     | Flat +5% across all mission types                                                                             |

### **4.3.1 Mission EXP Tiers**

| **Routine Daily Missions** | 50–100 EXP. Basic spiritual obligations. Subject to daily EXP cap. |
| -------------------------- | ------------------------------------------------------------------ |
| **Special Weekly Quests**  | 300–500 EXP. Scheduled study circles or lectures.                  |
| **Monthly Dungeon Raids**  | 1,000+ EXP. High-impact community events. No cap.                  |

## **4.4 Rank System**

| **Seeker (Level 1–9)**     | Starting rank. A hero searching for light amidst The Void.  |
| -------------------------- | ----------------------------------------------------------- |
| **Acolyte (Level 10–24)**  | Committed to routine sanctuary missions.                    |
| **Guardian (Level 25–39)** | True protectors of the Sanctuary.                           |
| **Warden (Level 40–49)**   | Leaders of Dungeon Raids. Can act as raid leaders.          |
| **Exalted (Level 50+)**    | Legends whose spiritual activity holds back the Doom Meter. |

Ranks display as glowing badges on the player's SAO-inspired HUD, visible to all other Reclaimers.

## **4.5 Inventory & Equipment**

| **Default Slots** | 20 (expandable via level milestones)                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Item Types**    | Aura Gear (avatar appearance), Focus Relics (passive stat boosts), Consumables (one-time use, e.g. Spirit Refresh) |
| **Rarity Tiers**  | Common (White), Uncommon (Green), Rare (Blue), Epic (Purple), Legendary (Gold)                                     |
| **Rare+ Source**  | Dungeon Raids and high-consistency Streaks only — not random drop from routine missions                            |
| **Customisation** | Avatar limited to admin-provided options; player chooses Hero Name freely                                          |

# **5\. Dungeon (Mosque) System**

## **5.1 Dungeon Tiers**

| **Tier 1 — Outpost**       | Small prayer rooms (Musholla). Solo play. Basic EXP. Ideal for beginners. |
| -------------------------- | ------------------------------------------------------------------------- |
| **Tier 2 — Sanctuary**     | Neighborhood mosques. Small groups of 3–5 players. Standard missions.     |
| **Tier 3 — Fortress**      | District mosques. Mid-level missions. Stronger Void resistance.           |
| **Tier 4 — Citadel**       | Major city mosques. High collective participation required.               |
| **Tier 5 — Grand Bastion** | National landmarks. Epic Raid locations. Legendary Equipment drops.       |

## **5.2 Dungeon States**

| **Radiant (Active)**      | Steady golden-cyan glow + floating light particles. High player activity. Grants 10% EXP Sanctuary Bonus. |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Dormant (Fading)**      | Flickering light. Alerts nearby Reclaimers that the area needs attention.                                 |
| **Corrupted (Void Zone)** | Dark fractured icon with purple mist. Players must complete Purification Missions to restore.             |
| **Siege (Raid)**          | Massive vertical red light beam visible from a distance. Limited-time event for Legendary Loot drops.     |

## **5.3 Dungeon Champion**

Each dungeon tracks two monthly champion titles:

- Highest Level Champion: Player who reaches the highest total level that month within the dungeon
- Most Progressive Champion: Player who shows the highest EXP growth percentage in the 30-day window

Champion titles reset monthly. Champions receive a visible crown badge and priority for real-life rewards.

## **5.4 Tap-In / Check-In System (Reverse Scanner Model)**

ARCHITECTURE: Each player holds a Unique Static QR Code as their Digital ID.

Each mosque provides a dedicated Scanner Device (tablet or IoT scanner) at the entrance.

FLOW:

1\. Player selects a quest on the sanctuary's scanner interface (e.g. 'Fajr Congregational Prayer')

2\. Player presents their personal QR ID to the scanner

3\. Backend performs server-side validation: checks Tap-In timestamp vs. local prayer schedule API for that Mosque ID

4\. If within the valid 60-minute window, mission is marked Success

5\. EXP, Loot, and Light Points are credited instantly via real-time sync

FALLBACK: GM can manually approve if scanner is unavailable. Photo/video upload also accepted for off-site missions.

# **6\. Quest & Mission System**

## **6.1 Mission Types**

| **Daily Prayer Attendance**      | Fardhu prayers at the mosque. Validated by Tap-In scanner within 60-minute window. |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| **Quran Reading / Memorisation** | Recitation and memorization tasks. Validated by GM or photo/video proof.           |
| **Community Service**            | Physical service at the mosque. Photo proof required.                              |
| **Learning / Quiz Challenge**    | In-app quizzes tied to study circle attendance. Auto-validated.                    |
| **Group / Team Missions**        | Requires 2+ players to check in simultaneously. System detects concurrent Tap-Ins. |
| **Special Event Missions**       | Tied to real-world events (Ramadan, Islamic holidays). GM-created from templates.  |
| **Photo / Video Proof**          | Player submits visual evidence. GM or Validator reviews within 24 hours.           |
| **Time-Limited Missions**        | Fixed window (e.g. Fajr only). Expires if not completed in time.                   |

## **6.2 Mission Configuration**

| **Daily Mission Limit** | 3 missions per day per player                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| **Cooldown / Reset**    | Daily (midnight), Weekly (Monday), Monthly (1st). All adjustable by GM.                  |
| **Validation Methods**  | QR Tap-In (primary), Photo/video upload, GM manual approval, Player self-report (honour) |
| **GM Override**         | GM can manually approve, reject, or modify any mission submission                        |

## **6.3 Quest Master Architecture**

The quest system operates on a two-tier architecture to ensure consistency:

- Super-Admin creates and owns the Quest Master List — the single source of truth for all mission types, EXP values, and parameter assignments
- Dungeon GM (Mosque Admin) selects from approved Master Templates and maps them to their local schedule and prayer times
- Dungeon GM cannot create new quest types or modify EXP/reward values — only schedule timing and toggle local prize availability

# **7\. Rewards & Economy**

## **7.1 In-Game Rewards**

- EXP points (fed into character progression)
- Equipment / Gear (Aura Gear, Focus Relics, Consumables)
- Titles & Badges (Rank progression, Champion crowns)
- Dungeon Champion Crown (monthly, per dungeon)
- Cosmetic items (avatar frames, particle effects)

## **7.2 Real-Life Reward System**

Spirit Link connects digital achievements to physical rewards via two parallel tracks:

| **Achievement-Based Awards**  | Monthly Top Player (highest EXP) and Most Progressed Player (highest EXP growth in 30 days) receive high-value prizes: electronic gadgets, school scholarships, or exclusive merchandise. Funded by mosque foundations, local merchants, or corporate sponsors. |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Soul-Market (Point-Based)** | Players exchange accumulated Light Points for everyday items: food vouchers, school supplies, stationery. Available continuously.                                                                                                                               |

## **7.3 Reward Redemption Flow (Anti-Fraud)**

All physical reward redemptions follow this secure flow:

- Player generates a Single-Use Redemption QR Code within the app
- Player presents the code at the physical mosque location
- Mosque Admin scans or verifies the code via the GM Dashboard
- Admin confirms physical hand-over of the prize
- System marks the transaction as Fulfilled, deducting Light Points
- Full audit trail maintained: digital point deduction linked to physical distribution record

# **8\. Social & Community Features**

| **Global Leaderboard**       | Top players across all dungeons by total EXP. Resets monthly.                    |
| ---------------------------- | -------------------------------------------------------------------------------- |
| **Per-Dungeon Leaderboard**  | Top players within each specific mosque. Champion tracking.                      |
| **Guilds / Teams**           | Player groups for coordinating Dungeon Raids. Team EXP contributions tracked.    |
| **Player Profiles (Public)** | Public hero profile showing rank, class, badges, and active dungeon.             |
| **Friend System**            | Add friends, see friend activity, and coordinate missions.                       |
| **Push Notifications**       | Mission reminders, Doom Meter alerts, raid announcements, reward availability.   |
| **Parent Dashboard**         | Read-only view of child's check-in history, EXP, and rank. Weekly email summary. |

# **9\. Onboarding — The Activation Ceremony**

Onboarding is designed as a high-energy 'Activation Ceremony', not a standard registration. Target completion time: under 60 seconds.

| **Step 1 — Cinematic Intro**      | HUD overlay showing The Void consuming the local map. System transmission invites player to become a Reclaimer.                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Step 2 — Hero Setup**           | Player enters Hero Name and selects Character Class via a visual carousel (Quran Protector, Da'i, Scholar, Mu'min).                 |
| **Step 3 — Authentication**       | Google Social Auth (primary) or One-Click Guest Account. System generates Unique Static QR ID instantly.                            |
| **Step 4 — Initial Sync Mission** | App points to nearest Dormant Sanctuary on the map. Zero-Level Quest: 'Ignite the Spark' — player performs first real-world Tap-In. |
| **Tutorial Method**               | Animated SAO-style tooltips during first mission. Learn-by-Doing rather than static tutorial screens.                               |

# **10\. GM Backoffice Dashboard**

## **10.1 Role Permissions Matrix**

| **Feature**        | **Super-Admin** | **Mosque GM** | **Quest Creator** | **Validator** | **Parent** |
| ------------------ | --------------- | ------------- | ----------------- | ------------- | ---------- |
| Quest Master List  | **Full CRUD**   | Read only     | **Full CRUD**     | None          | None       |
| Quest Scheduling   | Full            | Own dungeon   | None              | None          | None       |
| Mission Validation | Full            | Own dungeon   | None              | Own dungeon   | None       |
| Dungeon Registry   | Full            | Read only     | None              | None          | None       |
| Player Management  | Full            | Own dungeon   | None              | None          | None       |
| Prize Inventory    | Full            | Own dungeon   | None              | None          | None       |
| Analytics          | Full            | Own dungeon   | None              | None          | Child only |
| Hard Reset         | **Only**        | None          | None              | None          | None       |

## **10.2 Key Dashboard Features**

- Quest editor: select from Master Templates, assign to local schedule with prayer time windows
- Mission validation queue: approve/reject player submissions with photo/video review
- Prize inventory management: toggle reward availability based on physical stock
- Scanner device management: link and monitor mosque tablet/IoT scanner devices
- Player management: view, promote, or flag players within assigned dungeon
- Broadcast announcements: push notifications to players of assigned dungeon
- Redemption verification: scan player QR codes to fulfil and mark real-life rewards

## **10.3 Analytics Dashboard (Super-Admin)**

| **Doom Meter Dynamics**        | Real-time trend line: Global Decay rate vs. Recovery rate. Monitors the balance of The Void.                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Sanctuary Heatmap**          | Visual map of top active mosques and peak Tap-In hours. Tracks Dormant-to-Radiant transitions.                    |
| **Player Class Distribution**  | Breakdown of Character Specialization choices to monitor balance of the 5 Core Parameters.                        |
| **Reward & Fulfillment Audit** | Soul-Market economy tracker: Light Points spent vs. Physical Prize Inventory per mosque. Exportable for sponsors. |

# **11\. UI / UX Design Specification**

## **11.1 Visual Theme**

| **Theme Name**          | High-Tech Spiritual                                                              |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Primary Inspiration** | Sword Art Online (SAO) — dark-mode HUD, sleek futuristic interface               |
| **Primary Colors**      | #00F2FF Electric Cyan, #0A192F Deep Midnight Blue                                |
| **Accent Colors**       | #FFD700 Radiant Gold (legendary items, Radiant state, high ranks)                |
| **Antagonist Colors**   | #4B0082 Deep Purple, #FF0000 Crimson Red (Void / corrupted / Eclipse state only) |
| **Text Color**          | #F0F8FF Neon White on semi-transparent dark backgrounds                          |
| **UI Mode**             | Dark mode primary. High legibility on mobile browsers in varied lighting.        |

## **11.2 Navigation**

- Bottom tab bar (mobile-first): Map, Quests, Hero Profile, Leaderboard, Backpack
- Side drawer: Settings, Parent mode, Language toggle, QR ID display
- Full-screen map always accessible via Map tab

## **11.3 Doom Meter UI Transitions**

The UI must dynamically shift appearance based on the current Doom Meter stage. This is a core engagement mechanic and must be implemented as a global theme layer:

- Radiant stage: gold-cyan palette, particle effects, calm HUD sound
- Dusk stage: amber bleeds in, UI slightly desaturated, urgency tone increases
- Shadow stage: purple glitch overlay, slight UI distortion effect, EXP bonus notification
- Eclipse stage: full crimson-red crisis HUD, flashing elements, alarm notification, emergency raid trigger

# **12\. Technical Architecture**

## **12.1 Recommended Stack**

| **Frontend**           | React + Vite (PWA). Tailwind CSS for styling. Deployed to Vercel or Netlify (free tier). |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **Map Layer**          | Leaflet.js (open-source, lightweight — no API key or cost)                               |
| **Backend / Database** | Supabase (PostgreSQL, Auth, Realtime, Storage — free tier: 500MB DB, 1GB storage)        |
| **Authentication**     | Supabase Auth with Google OAuth provider + anonymous/guest accounts                      |
| **QR Code**            | qrcode.js (generation), html5-qrcode (scanning) — both open source                       |
| **Push Notifications** | Supabase Realtime + Web Push API (service worker)                                        |
| **Prayer Time API**    | Aladhan API (free, no key required) for mosque-specific prayer schedules                 |
| **Hosting**            | Vercel (free tier) — PWA-compatible, HTTPS required for GPS and camera                   |
| **AI Assets**          | Generate sprites/icons via Midjourney or DALL-E; store in Supabase Storage               |

## **12.2 Key Technical Constraints**

- All features must work on Safari iOS and Chrome Android without app installation
- GPS/camera permissions require HTTPS — mandatory on Vercel/Netlify
- Supabase free tier: 500MB database, 1GB file storage, 50,000 monthly active users — sufficient for pilot
- Target initial load under 3 seconds on 4G mobile connections
- QR ID is server-generated, static, and unique per player — stored in Supabase
- Prayer time validation is server-side only — client cannot manipulate timestamps

# **13\. Feature Priority & Build Roadmap**

## **13.1 MoSCoW Priority Matrix**

| **Feature**                        | **Priority**    | **Phase** | **Notes**               |
| ---------------------------------- | --------------- | --------- | ----------------------- |
| Player registration + Google Auth  | **Must Have**   | Phase 1   | Core access gate        |
| Unique QR ID generation            | **Must Have**   | Phase 1   | Core to Tap-In system   |
| Dungeon map (Leaflet.js)           | **Must Have**   | Phase 1   | Core gameplay surface   |
| Dungeon states (4 visual states)   | **Must Have**   | Phase 1   | Engagement mechanic     |
| Tap-In QR scanner (mosque device)  | **Must Have**   | Phase 1   | Mission validation core |
| Prayer time API integration        | **Must Have**   | Phase 1   | Auto-validation engine  |
| Daily mission system (3/day limit) | **Must Have**   | Phase 1   | Core loop               |
| EXP + level progression            | **Must Have**   | Phase 1   | Reward feedback         |
| Doom Meter (global state)          | **Must Have**   | Phase 1   | World mechanic          |
| GM dashboard — quest scheduling    | **Must Have**   | Phase 1   | Operations              |
| GM dashboard — mission approval    | **Must Have**   | Phase 1   | Operations              |
| Character class selection          | **Should Have** | Phase 2   | Engagement depth        |
| Inventory / equipment system       | **Should Have** | Phase 2   | Reward system           |
| Rank badges on profile             | **Should Have** | Phase 2   | Social status           |
| Per-dungeon leaderboard            | **Should Have** | Phase 2   | Competition             |
| Soul-Market redemption             | **Should Have** | Phase 2   | Real-life bridge        |
| Global leaderboard                 | **Should Have** | Phase 2   | Competition             |
| Cinematic onboarding flow          | **Should Have** | Phase 2   | First impression        |
| Doom Meter UI skin transitions     | **Should Have** | Phase 2   | Immersion               |
| Guild / team system                | **Could Have**  | Phase 3   | Community               |
| Parent dashboard                   | **Could Have**  | Phase 3   | Trust & safety          |
| Push notifications                 | **Could Have**  | Phase 3   | Retention               |
| Analytics dashboard (Super-Admin)  | **Could Have**  | Phase 3   | Operations insight      |
| Dungeon Raid (Siege) events        | **Could Have**  | Phase 3   | Peak engagement         |
| Friend system                      | **Could Have**  | Phase 3   | Social                  |
| Sponsor integration for prizes     | **Could Have**  | Phase 3   | Sustainability          |

## **13.2 Recommended Build Order**

Given a Basic HTML/CSS skill level and a sub-\$500 budget, the recommended approach is to use Claude to generate each module iteratively. Start with:

- Phase 1A — Foundation: Supabase setup, Auth, player registration, QR ID generation
- Phase 1B — The Map: Leaflet.js dungeon map with 5 pilot mosque pins and dungeon state display
- Phase 1C — Tap-In Core: QR scanner interface for mosque tablet, prayer time API, server-side validation
- Phase 1D — Core Loop: Daily mission list, EXP award, level display, Doom Meter counter
- Phase 1E — GM Dashboard: Quest scheduling, mission approval queue, basic player management
- Phase 2 — Character & Rewards: Class selection, inventory, ranks, Soul-Market, leaderboards
- Phase 3 — Polish & Scale: Onboarding animation, UI skin transitions, parent dashboard, raids, notifications

# **14\. Open Questions & Decisions Required**

| **OQ-01** | Who physically provides and maintains the scanner tablet at each mosque? Is there a device budget separate from development? |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **OQ-02** | What is the prayer time data source for each pilot mosque? Will imams confirm their schedules in the system?                 |
| **OQ-03** | Who funds the real-life prizes at launch? Are sponsors confirmed or still being sought?                                      |
| **OQ-04** | Is the app bilingual from day one, or English first with Bahasa Indonesia added in Phase 2?                                  |
| **OQ-05** | How should guest accounts convert to full accounts? Can guest EXP be retained?                                               |
| **OQ-06** | What is the Hard Reset ceremony for Global Over — who organises the real-world coordinated event?                            |
| **OQ-07** | Is the app open to the public from day one, or invite-only / mosque-gated during pilot?                                      |
| **OQ-08** | How are abuse cases handled — e.g. player sharing their QR ID with someone else to fake check-ins?                           |

**End of Requirements Document**

_Spirit Link v1.0 | April 2026 | Connect Your Soul, Awaken the Hero_