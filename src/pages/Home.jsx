import {useEffect, useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {supabase} from '../lib/supabaseClient';
import {Link} from 'react-router-dom';

export default function Home({session}) {
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase
      .from('players')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({data, error}) => {
        if (error) setError(error.message);
        else setPlayer(data);
      });
  }, [session.user.id]);

  const startEdit = () => {
    setNameInput(player.hero_name);
    setMsg('');
    setEditing(true);
  };

  const saveName = async (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (name.length < 3 || name.length > 20) {
      setMsg('Nama hero harus 3-20 karakter');
      return;
    }
    setSaving(true);
    const {data, error} = await supabase.from('players').update({hero_name: name}).eq('id', session.user.id).select().single();
    setSaving(false);
    if (error) {
      setMsg(error.message);
    } else {
      setPlayer(data);
      setEditing(false);
    }
  };

  const logout = () => supabase.auth.signOut();

  if (error) return <p className="p-6 text-red-400">Error: {error}</p>;
  if (!player) return <p className="p-6 text-[#00F2FF]">Memuat data hero...</p>;

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-5 px-6 text-[#F0F8FF]">
      {editing ? (
        <form onSubmit={saveName} className="flex flex-col items-center gap-2">
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} maxLength={20} autoFocus className="rounded-lg bg-white/10 border border-[#00F2FF] px-3 py-2 text-center text-lg outline-none" />
          <div className="flex gap-3 text-sm">
            <button type="submit" disabled={saving} className="text-[#00F2FF] font-semibold disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="opacity-60">
              Batal
            </button>
          </div>
          {msg && <p className="text-xs text-red-400">{msg}</p>}
        </form>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold text-[#FFD700]">{player.hero_name}</h2>
          <button onClick={startEdit} className="text-xs text-[#00F2FF] underline">
            Ganti nama hero
          </button>
        </div>
      )}

      <p className="text-sm opacity-70">
        Level {player.level} · {player.total_exp} EXP {player.is_guest && '· Akun Tamu'}
      </p>

      <div className="rounded-xl bg-white p-4">
        <QRCodeSVG value={player.qr_id} size={200} />
      </div>
      <p className="text-xs opacity-50 break-all max-w-xs text-center">{player.qr_id}</p>

      <Link to="/map" className="rounded-lg bg-[#00F2FF] px-6 py-3 font-semibold text-[#0A192F]">
        Buka Peta Dungeon
      </Link>

      <button onClick={logout} className="mt-4 text-sm text-[#00F2FF] underline">
        Keluar
      </button>
    </div>
  );
}
