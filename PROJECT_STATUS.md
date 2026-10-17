# PROJECT STATUS - SPIRIT LINK

**Terakhir diperbarui:** 17 Oktober 2026
**Sumber kebenaran fitur:** `spirit-link-prd.md`
**Legenda status:** `Belum` | `Kode selesai` (kode ada, belum diverifikasi) | `Sudah dites` (lolos test script + test manual)

> Catatan: status "Sudah dites" hanya boleh diisi setelah Fatih melaporkan hasil test. Semua fase di bawah baru sampai "Kode selesai" kecuali tertulis lain.

---

## 1. Status per Fase

| Fase | Cakupan | Status | Tanggal | Catatan |
|---|---|---|---|---|
| 1A | Foundation: Auth (Google + Tamu), tabel `players`, QR ID | Kode selesai | - | `Login.jsx`, `Home.jsx`, `useAuth`. Guest butuh "Anonymous sign-ins" aktif di Dashboard (di `config.toml` lokal masih `false`). |
| 1B | Peta Leaflet + 4 state dungeon | Kode selesai | - | `MapPage.jsx`, `dungeonStates.js`. Tabel `dungeons` tidak ada di migrasi. |
| 1C | Tap-In: Scanner masjid + Edge Function `tap-in` + jadwal sholat Aladhan | Kode selesai | - | `Scanner.jsx`, `supabase/functions/tap-in`. Tabel `tap_ins`, `dungeon_scanners`, fungsi `award_exp` tidak ada di migrasi. |
| 1D | Core loop: misi harian, EXP, level, Doom Meter | Sebagian | - | EXP + level ada. **Doom Meter belum ada.** Batas 3 misi/hari hanya di Tap-In. |
| 1E | GM Dashboard (validasi, scheduling, Quest Master) | Kode selesai | 13 Okt 2026 | Migrasi `20261013_gm_dashboard_schema.sql`. Test: `test-scripts/fase-1/`. |
| 1F | Submission pemain (`/missions`, `/my-submissions`) | Kode selesai | 13 Okt 2026 | Test: `test-scripts/fase-1f/`. |
| 2 (class & rank) | Pilih class, level 1-100, rank, multiplier EXP, `/character` | Kode selesai | 13 Okt 2026 | Migrasi `20261013_character_classes.sql`. Ada celah keamanan (lihat bagian 3). |

## 2. Cakupan PRD (MoSCoW)

### Phase 1 (Must Have)
| Fitur | Status |
|---|---|
| Registrasi + Google Auth | Kode selesai |
| QR ID unik | Kode selesai |
| Peta dungeon (Leaflet) | Kode selesai |
| 4 state dungeon (visual) | Kode selesai (state dari kolom DB, belum otomatis) |
| Tap-In QR scanner | Kode selesai |
| Integrasi API jadwal sholat | Kode selesai |
| Sistem misi harian (limit 3/hari) | Sebagian |
| EXP + level | Kode selesai |
| **Doom Meter (global)** | **Belum** |
| GM dashboard: scheduling | Kode selesai |
| GM dashboard: approval | Kode selesai |

### Phase 2 (Should Have)
| Fitur | Status |
|---|---|
| Pilih class | Kode selesai |
| Rank badge | Kode selesai |
| Inventory / equipment | Belum |
| Leaderboard per-dungeon | Belum |
| Leaderboard global | Belum |
| Soul-Market redemption | Belum |
| Onboarding sinematik | Belum |
| Doom Meter UI skin | Belum |

### Phase 3 (Could Have)
Guild, parent dashboard, push notification, analytics Super-Admin, Siege/Raid, friend system, sponsor: semuanya **Belum**.

## 3. Temuan / Utang Teknis (harus diselesaikan di Tahap 0 fase berikutnya)

### Prioritas tinggi (keamanan & integritas)
1. **`package.json` tidak sinkron dengan `package-lock.json` dan kode.**
   - `package.json`: React 18, Vite 5, `lucide-react`, `qrcode`; tidak ada `leaflet`, `html5-qrcode`, `qrcode.react`, `tailwindcss`, `@tailwindcss/vite`.
   - Lockfile: React 19, Vite 8, `leaflet`, `html5-qrcode`, `qrcode.react`, Tailwind; tidak ada `lucide-react`.
   - Kode memakai: `leaflet`, `html5-qrcode`, `qrcode.react`, `lucide-react`, Tailwind.
2. **Objek DB dipakai kode tapi tidak ada di migrasi:** tabel `players`, `dungeons`, `tap_ins`, `dungeon_scanners`; fungsi `award_exp`; kolom `players.dungeon_id`, `qr_id`, `hero_name`, `is_guest`, `updated_at`. Perlu di-dump dari database yang berjalan lalu dijadikan migrasi.
3. **Klien bisa mengubah `character_class` langsung** (`Home.jsx` memakai `.update()`). Jika RLS `players` mengizinkan update kolom bebas, pemain bisa mengubah `total_exp`/`level` sendiri. Perlu RPC `select_character_class` + trigger pembatas kolom sensitif.
4. **`approve_mission_v2` / `approve_mission` / `reject_mission` (`SECURITY DEFINER`) tidak mengecek hak pemanggil.** Perlu cek `is_dungeon_admin(auth.uid(), dungeon_id)` atau `is_super_admin`, serta `SET search_path`. Parameter `p_validator_id` sebaiknya diganti `auth.uid()`.
5. **Insert submission tidak memvalidasi `dungeon_id` cocok dengan quest dan dungeon pemain** (dicatat juga di dokumentasi test 1F).
6. **Policy `mission_submissions` UPDATE untuk GM tanpa batasan kolom.** GM bisa mengubah kolom apa pun lewat API, tidak hanya status.

### Prioritas sedang (konsistensi & bug)
7. Tap-In memberi EXP flat 50 lewat `award_exp` tanpa multiplier class dan tanpa pencatatan di `mission_submissions` (dua jalur EXP berbeda).
8. Batas harian 3 misi hanya berlaku di Tap-In, belum di jalur submission.
9. `MissionsPage` mengecek "sudah submit hari ini" memakai tanggal UTC; `submitted_date` di DB memakai `CURRENT_DATE` (zona server). Harus WIB.
10. `RankBadge` memakai kelas Tailwind dinamis (`bg-${color}-400`) yang tidak ter-generate. Ganti peta kelas literal.
11. `ClassCard` memakai `shadow-${color}-500/50` dan `hover:scale-102` (kelas dinamis/tidak valid).
12. `Home.jsx` menampilkan link "GM Dashboard" ke semua pemain.
13. Tidak ada `level` dibatasi/validasi saat `award_exp` dan `approve_mission_v2` menghitung level dengan dua cara berbeda (`award_exp` belum tentu memakai `calculate_level`). Satukan.

### Prioritas rendah (rapi-rapi)
14. Nama file migrasi `20261013_*.sql` tidak mengikuti format `YYYYMMDDHHMMSS`; dua file di tanggal sama berisiko urutan salah.
15. `test-scripts/fase-1/*.js` membaca `.env.local` dengan path `'..'` (seharusnya `'..', '..'`). `test-database.js` fase-1 memanggil `supabase.auth.admin.listUsers()` dengan anon key (selalu gagal).
16. `test-fase-1e.sql` memakai `\echo` (hanya jalan di `psql`, bukan di Supabase SQL Editor).
17. Dokumentasi test lama menyebut `scripts/test-database.js` dan `npm run test:db` (sudah diganti `test:fase1:db`).
18. `README.md` masih bawaan template Vite; `index.html` title masih `spirit-link`; belum ada PWA manifest/service worker walau `vite-plugin-pwa` ada di lockfile.
19. Fase 2 belum punya `test-scripts/fase-2/` dan `dokumentasi-test-dan-verifikasi/fase-2/`.
20. Submission foto masih input URL manual (belum Supabase Storage).
21. Pertanyaan terbuka PRD OQ-01..OQ-08 belum diputuskan (terutama OQ-04 bilingual, OQ-05 konversi akun tamu, OQ-08 QR dibagikan).

## 4. Rekomendasi Urutan Fase Berikutnya

1. **Fase 1G: Stabilisasi & Hardening** (wajib sebelum fitur baru)
   - Sinkronkan dependensi (poin 1), baseline migrasi DB (poin 2), amankan RLS/RPC (poin 3-6), perbaiki bug Tailwind & WIB (poin 9-12), rapikan test script (poin 15-17), buat test Fase 2.
2. **Fase 1H: Doom Meter** (Must Have Phase 1 yang tertinggal)
   - Tabel state global, decay harian, recovery dari check-in, tampilan HUD dasar.
3. **Fase 2A: Leaderboard** (per-dungeon + global, reset bulanan, Dungeon Champion)
4. **Fase 2B: Inventory & Equipment**
5. **Fase 2C: Soul-Market** (redemption QR sekali pakai)
6. **Fase 2D: Onboarding sinematik + Doom Meter UI skin**
7. **Fase 3:** guild, parent dashboard, notifikasi, analytics, raid, friend, sponsor (pecah per sub-fase).

## 5. Ringkasan Struktur Repo

```
src/pages        Login, Home, MapPage, Scanner, GMDashboard, MissionsPage, MySubmissionsPage, CharacterPage
src/components   ClassCard, ClassSelectionModal, RankBadge, LevelProgressBar, QuestCard, SubmissionModal, SubmissionCard, StatusBadge
src/lib          supabaseClient.js, dungeonStates.js
src/hooks        useAuth.js
supabase/migrations   20261013_gm_dashboard_schema.sql, 20261013_character_classes.sql
supabase/functions    tap-in (index.ts)
test-scripts/fase-1, fase-1f
dokumentasi-test-dan-verifikasi/fase-1, fase-1f
```

Rute: `/`, `/login`, `/map`, `/scanner`, `/gm`, `/missions`, `/my-submissions`, `/character`.

## 6. Cara Melanjutkan

Buka session chat baru di project ini, pastikan file GitHub sudah disinkronkan, lalu ketik:

> **Lanjut ke fase berikutnya**
