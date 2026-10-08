import {useState} from 'react';
import {supabase} from '../lib/supabaseClient';

export default function Login() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loginGuest = async () => {
    setBusy(true);
    setError('');
    const {error} = await supabase.auth.signInAnonymously();
    if (error) setError(error.message);
    setBusy(false);
  };

  const loginGoogle = async () => {
    setError('');
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {redirectTo: window.location.origin},
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-6 px-6 text-[#F0F8FF]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#00F2FF]">Spirit Link</h1>
        <p className="mt-2 text-sm opacity-70">Connect Your Soul, Awaken the Hero</p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <button onClick={loginGoogle} className="rounded-lg bg-[#00F2FF] py-3 font-semibold text-[#0A192F] active:scale-95 transition">
          Masuk dengan Google
        </button>
        <button onClick={loginGuest} disabled={busy} className="rounded-lg border border-[#00F2FF] py-3 font-semibold text-[#00F2FF] disabled:opacity-50 active:scale-95 transition">
          {busy ? 'Memproses...' : 'Masuk sebagai Tamu'}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
