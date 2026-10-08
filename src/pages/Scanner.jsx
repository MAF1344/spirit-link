import {useEffect, useRef, useState} from 'react';
import {Html5Qrcode} from 'html5-qrcode';
import {supabase} from '../lib/supabaseClient';

const PRAYERS = [
  {key: 'fajr', label: 'Subuh'},
  {key: 'dhuhr', label: 'Dzuhur'},
  {key: 'asr', label: 'Ashar'},
  {key: 'maghrib', label: 'Maghrib'},
  {key: 'isha', label: 'Isya'},
];

function ScannerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const {error} = await supabase.auth.signInWithPassword({email, password});
    if (error) setError(error.message);
  };

  return (
    <form onSubmit={submit} className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-3 px-6 text-[#F0F8FF]">
      <h1 className="text-2xl font-bold text-[#00F2FF]">Login Scanner Masjid</h1>
      <input type="email" placeholder="Email scanner" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full max-w-xs rounded-lg bg-white/10 border border-[#00F2FF] px-3 py-2 outline-none" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full max-w-xs rounded-lg bg-white/10 border border-[#00F2FF] px-3 py-2 outline-none" />
      <button type="submit" className="w-full max-w-xs rounded-lg bg-[#00F2FF] py-2 font-semibold text-[#0A192F]">
        Masuk
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}

export default function Scanner({session}) {
  const [dungeonName, setDungeonName] = useState(null); // null = memuat, false = bukan scanner
  const [prayer, setPrayer] = useState('fajr');
  const [scanning, setScanning] = useState(false);
  const [manualQr, setManualQr] = useState('');
  const [result, setResult] = useState(null);

  const prayerRef = useRef(prayer);
  prayerRef.current = prayer;
  const scannerRef = useRef(null);
  const busyRef = useRef(false);

  // Cek apakah akun ini scanner, dan masjid mana
  useEffect(() => {
    if (!session) return;
    supabase
      .from('dungeon_scanners')
      .select('dungeons(name)')
      .maybeSingle()
      .then(({data}) => setDungeonName(data ? data.dungeons.name : false));
  }, [session]);

  // Matikan kamera saat halaman ditutup
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const submit = async (qrId) => {
    const {data, error} = await supabase.functions.invoke('tap-in', {
      body: {qr_id: qrId.trim(), prayer: prayerRef.current},
    });
    if (error) {
      const body = error.context ? await error.context.json().catch(() => null) : null;
      setResult({ok: false, text: body?.error ?? error.message});
    } else {
      setResult({ok: true, text: `${data.hero_name} berhasil Tap-In (${data.prayer})`});
    }
  };

  const onScan = async (text) => {
    if (busyRef.current) return;
    busyRef.current = true;
    await submit(text);
    setTimeout(() => {
      busyRef.current = false;
    }, 2500); // jeda agar tidak memindai berulang
  };

  const startCamera = async () => {
    setResult(null);
    try {
      const qr = new Html5Qrcode('qr-reader');
      scannerRef.current = qr;
      await qr.start({facingMode: 'environment'}, {fps: 10, qrbox: 220}, onScan, () => {});
      setScanning(true);
    } catch (err) {
      setResult({ok: false, text: `Kamera gagal dibuka: ${err}`});
    }
  };

  const stopCamera = async () => {
    await scannerRef.current?.stop().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
  };

  const submitManual = async (e) => {
    e.preventDefault();
    if (manualQr.trim()) await submit(manualQr);
  };

  const logout = async () => {
    await stopCamera();
    await supabase.auth.signOut();
  };

  if (!session) return <ScannerLogin />;
  if (dungeonName === null) return <p className="p-6 text-[#00F2FF]">Memuat...</p>;
  if (dungeonName === false) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-4 px-6 text-center text-[#F0F8FF]">
        <p className="text-red-400">Akun ini bukan akun scanner masjid.</p>
        <button onClick={logout} className="text-[#00F2FF] underline">
          Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center gap-4 px-4 py-6 text-[#F0F8FF]">
      <h1 className="text-xl font-bold text-[#FFD700] text-center">{dungeonName}</h1>

      <div className="flex flex-wrap justify-center gap-2">
        {PRAYERS.map((p) => (
          <button key={p.key} onClick={() => setPrayer(p.key)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${prayer === p.key ? 'bg-[#00F2FF] text-[#0A192F]' : 'border border-[#00F2FF] text-[#00F2FF]'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div id="qr-reader" className="w-full max-w-xs overflow-hidden rounded-lg" />

      {scanning ? (
        <button onClick={stopCamera} className="rounded-lg border border-red-400 px-4 py-2 text-red-400">
          Matikan Kamera
        </button>
      ) : (
        <button onClick={startCamera} className="rounded-lg bg-[#00F2FF] px-4 py-2 font-semibold text-[#0A192F]">
          Nyalakan Kamera
        </button>
      )}

      <form onSubmit={submitManual} className="flex w-full max-w-xs gap-2">
        <input value={manualQr} onChange={(e) => setManualQr(e.target.value)} placeholder="Atau tempel QR ID" className="min-w-0 flex-1 rounded-lg bg-white/10 border border-white/30 px-3 py-2 text-sm outline-none" />
        <button type="submit" className="rounded-lg border border-[#00F2FF] px-3 text-sm text-[#00F2FF]">
          Kirim
        </button>
      </form>

      {result && <p className={`w-full max-w-xs rounded-lg p-3 text-center text-sm ${result.ok ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{result.text}</p>}

      <button onClick={logout} className="mt-2 text-sm text-[#00F2FF] underline">
        Keluar
      </button>
    </div>
  );
}
