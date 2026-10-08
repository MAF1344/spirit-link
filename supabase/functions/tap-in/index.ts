import { createClient } from 'npm:@supabase/supabase-js@2'

const TZ = 'Asia/Jakarta' // semua masjid pilot ada di WIB
const WINDOW_MINUTES = Number(Deno.env.get('TAPIN_WINDOW_MINUTES') ?? '60')

const PRAYER_KEYS: Record<string, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d).replace('.', ':')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Gunakan POST' }, 405)

  // 1. Siapa yang memanggil?
  const caller = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
  )
  const { data: { user }, error: authError } = await caller.auth.getUser()
  if (authError || !user) return json({ error: 'Belum login' }, 401)

  // Client admin: satu-satunya yang boleh menulis ke tap_ins
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 2. Validasi input
  let body: { qr_id?: string; prayer?: string }
  try { body = await req.json() } catch { return json({ error: 'Body bukan JSON' }, 400) }
  const { qr_id, prayer } = body
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!qr_id || !uuidRe.test(qr_id)) return json({ error: 'QR tidak valid' }, 400)
  if (!prayer || !(prayer in PRAYER_KEYS)) return json({ error: 'Jenis sholat tidak valid' }, 400)

  // 3. Pemanggil harus akun scanner, dan masjid ditentukan SERVER (bukan klien)
  const { data: link } = await admin
    .from('dungeon_scanners').select('dungeon_id').eq('user_id', user.id).maybeSingle()
  if (!link) return json({ error: 'Akun ini bukan scanner masjid' }, 403)

  const { data: dungeon } = await admin
    .from('dungeons').select('name, latitude, longitude').eq('id', link.dungeon_id).single()
  if (!dungeon) return json({ error: 'Masjid tidak ditemukan' }, 500)

  // 4. Cari pemain dari QR
  const { data: player } = await admin
    .from('players').select('id, hero_name').eq('qr_id', qr_id).maybeSingle()
  if (!player) return json({ error: 'QR tidak dikenali' }, 404)

  // 5. Ambil jadwal sholat hari ini untuk koordinat masjid
  const now = new Date()
  const isoDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now) // YYYY-MM-DD
  const [y, m, d] = isoDate.split('-')

  const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}` +
    `?latitude=${dungeon.latitude}&longitude=${dungeon.longitude}&method=20`
  let timeStr: string | undefined
  try {
    const res = await fetch(url)
    const data = await res.json()
    timeStr = data?.data?.timings?.[PRAYER_KEYS[prayer]]
  } catch {
    return json({ error: 'Gagal mengambil jadwal sholat, coba lagi' }, 502)
  }
  const match = timeStr?.match(/(\d{1,2}):(\d{2})/)
  if (!match) return json({ error: 'Jadwal sholat tidak tersedia' }, 502)

  const start = new Date(`${isoDate}T${match[1].padStart(2, '0')}:${match[2]}:00+07:00`)
  const end = new Date(start.getTime() + WINDOW_MINUTES * 60_000)

  // 6. Cek jendela waktu memakai jam SERVER
  if (now < start) {
    return json({ error: `Belum masuk waktu ${prayer} (mulai ${fmtTime(start)} WIB)` }, 422)
  }
  if (now > end) {
    return json({ error: `Waktu Tap-In ${prayer} sudah lewat (berakhir ${fmtTime(end)} WIB)` }, 422)
  }

  // 7. Catat. Constraint unique mencegah Tap-In ganda untuk sholat yang sama.
  const { error: insertError } = await admin.from('tap_ins').insert({
    player_id: player.id,
    dungeon_id: link.dungeon_id,
    prayer,
    prayer_date: isoDate,
  })
  if (insertError) {
    if (insertError.code === '23505') {
      return json({ error: `${player.hero_name} sudah Tap-In ${prayer} hari ini` }, 409)
    }
    return json({ error: 'Gagal menyimpan Tap-In' }, 500)
  }

  return json({
    ok: true,
    hero_name: player.hero_name,
    dungeon: dungeon.name,
    prayer,
    window: `${fmtTime(start)}-${fmtTime(end)} WIB`,
  })
})