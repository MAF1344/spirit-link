import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {supabase} from '../lib/supabaseClient';

export default function GMDashboard({session}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dungeon, setDungeon] = useState(null);
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('validation');

  useEffect(() => {
    checkAccess();
  }, [session]);

  const checkAccess = async () => {
    const userId = session.user.id;

    const {data: roleData} = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (roleData) {
      setRole(roleData.role);
    }

    const {data: adminData} = await supabase
      .from('dungeon_admins')
      .select('dungeon_id, dungeons(name)')
      .eq('user_id', userId)
      .maybeSingle();

    if (adminData) {
      setDungeon({
        id: adminData.dungeon_id,
        name: adminData.dungeons.name,
      });
    }

    setLoading(false);
  };

  const logout = () => supabase.auth.signOut();

  if (loading) {
    return <div className="min-h-screen bg-[#0A192F] p-6 text-[#00F2FF]">Memuat...</div>;
  }

  if (!dungeon && role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-4 px-6 text-center text-[#F0F8FF]">
        <p className="text-red-400">Akses ditolak. Akun ini bukan Mosque Admin.</p>
        <button onClick={logout} className="text-[#00F2FF] underline">
          Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#F0F8FF]">
      <div className="border-b border-white/10 bg-[#0A192F]/95 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#FFD700]">GM Dashboard</h1>
            {dungeon && <p className="text-sm opacity-70">{dungeon.name}</p>}
            {role === 'super_admin' && <p className="text-xs text-[#FFD700]">Super Admin</p>}
          </div>
          <button onClick={logout} className="text-sm text-[#00F2FF] underline">
            Keluar
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/10 bg-[#0A192F]/90">
        <button onClick={() => setActiveTab('validation')} className={`flex-1 px-4 py-3 text-sm font-semibold ${activeTab === 'validation' ? 'border-b-2 border-[#00F2FF] text-[#00F2FF]' : 'text-white/60'}`}>
          Validasi Misi
        </button>
        <button onClick={() => setActiveTab('quests')} className={`flex-1 px-4 py-3 text-sm font-semibold ${activeTab === 'quests' ? 'border-b-2 border-[#00F2FF] text-[#00F2FF]' : 'text-white/60'}`}>
          Quest Scheduling
        </button>
        <button onClick={() => setActiveTab('master')} className={`flex-1 px-4 py-3 text-sm font-semibold ${activeTab === 'master' ? 'border-b-2 border-[#00F2FF] text-[#00F2FF]' : 'text-white/60'}`}>
          Quest Master
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'validation' && <ValidationQueue dungeonId={dungeon?.id} role={role} />}
        {activeTab === 'quests' && <QuestScheduling dungeonId={dungeon?.id} dungeonName={dungeon?.name} />}
        {activeTab === 'master' && <QuestMasterList role={role} />}
      </div>
    </div>
  );
}

function ValidationQueue({dungeonId, role}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, [dungeonId]);

  const loadSubmissions = async () => {
    setLoading(true);
    let query = supabase
      .from('mission_submissions')
      .select(`
        *,
        players(hero_name),
        dungeon_quests(
          quest_master(title, exp_reward)
        )
      `)
      .eq('status', 'pending')
      .order('submitted_at', {ascending: false});

    if (role !== 'super_admin' && dungeonId) {
      query = query.eq('dungeon_id', dungeonId);
    }

    const {data, error} = await query;
    if (!error) setSubmissions(data || []);
    setLoading(false);
  };

  const handleApprove = async (submissionId) => {
    setProcessing(submissionId);
    const {data, error} = await supabase.rpc('approve_mission_v2', {
      p_submission_id: submissionId,
      p_validator_id: (await supabase.auth.getUser()).data.user.id,
    });

    if (!error && data?.[0]?.success) {
      const result = data[0];
      let message = `Mission approved! Player mendapat ${result.exp_awarded} EXP`;
      
      if (result.multiplier > 1.0) {
        message += ` (${result.multiplier}x class bonus)`;
      }
      
      if (result.level_up) {
        message += `\n🎉 LEVEL UP! ${result.old_level} → ${result.new_level}`;
      } else {
        message += ` (Level ${result.new_level})`;
      }
      
      alert(message);
      loadSubmissions();
    } else {
      alert('Gagal approve: ' + (data?.[0]?.message || error?.message));
    }
    setProcessing(null);
  };

  const handleReject = async (submissionId) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;

    setProcessing(submissionId);
    const {data, error} = await supabase.rpc('reject_mission', {
      p_submission_id: submissionId,
      p_validator_id: (await supabase.auth.getUser()).data.user.id,
      p_reason: reason,
    });

    if (!error && data?.[0]?.success) {
      alert('Mission ditolak');
      loadSubmissions();
    } else {
      alert('Gagal reject: ' + (data?.[0]?.message || error?.message));
    }
    setProcessing(null);
  };

  if (loading) return <p className="text-center text-sm opacity-70">Memuat submission...</p>;
  if (submissions.length === 0) return <p className="text-center text-sm opacity-70">Tidak ada submission pending</p>;

  return (
    <div className="space-y-3">
      {submissions.map((sub) => (
        <div key={sub.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-[#FFD700]">{sub.players.hero_name}</h3>
              <p className="text-sm">{sub.dungeon_quests.quest_master.title}</p>
              <p className="text-xs opacity-60">Reward: {sub.dungeon_quests.quest_master.exp_reward} EXP</p>
            </div>
            <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">Pending</span>
          </div>

          {sub.proof_url && (
            <div className="my-2">
              <img src={sub.proof_url} alt="Bukti" className="max-h-48 rounded border border-white/20" />
            </div>
          )}

          {sub.notes && <p className="mb-2 text-sm italic opacity-70">Catatan: {sub.notes}</p>}

          <p className="mb-3 text-xs opacity-50">{new Date(sub.submitted_at).toLocaleString('id-ID')}</p>

          <div className="flex gap-2">
            <button onClick={() => handleApprove(sub.id)} disabled={processing === sub.id} className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold disabled:opacity-50">
              {processing === sub.id ? 'Memproses...' : 'Approve'}
            </button>
            <button onClick={() => handleReject(sub.id)} disabled={processing === sub.id} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold disabled:opacity-50">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestScheduling({dungeonId, dungeonName}) {
  const [masterQuests, setMasterQuests] = useState([]);
  const [scheduledQuests, setScheduledQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [formData, setFormData] = useState({
    schedule_type: 'daily',
    prayer_type: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadData();
  }, [dungeonId]);

  const loadData = async () => {
    setLoading(true);
    const [{data: master}, {data: scheduled}] = await Promise.all([
      supabase.from('quest_master').select('*').eq('is_active', true).order('title'),
      supabase.from('dungeon_quests').select('*, quest_master(title, exp_reward)').eq('dungeon_id', dungeonId).eq('is_active', true).order('created_at', {ascending: false}),
    ]);
    setMasterQuests(master || []);
    setScheduledQuests(scheduled || []);
    setLoading(false);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const {error} = await supabase.from('dungeon_quests').insert({
      dungeon_id: dungeonId,
      quest_master_id: selectedMaster.id,
      schedule_type: formData.schedule_type,
      prayer_type: formData.prayer_type || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      created_by: (await supabase.auth.getUser()).data.user.id,
    });

    if (error) {
      alert('Gagal schedule quest: ' + error.message);
    } else {
      alert('Quest berhasil dijadwalkan!');
      setShowForm(false);
      setSelectedMaster(null);
      loadData();
    }
  };

  const toggleQuestStatus = async (questId, currentStatus) => {
    const {error} = await supabase
      .from('dungeon_quests')
      .update({is_active: !currentStatus})
      .eq('id', questId);

    if (!error) loadData();
  };

  if (loading) return <p className="text-center text-sm opacity-70">Memuat...</p>;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#FFD700]">Quest Aktif di {dungeonName}</h2>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-[#00F2FF] px-3 py-1 text-sm font-semibold text-[#0A192F]">
            + Jadwalkan Quest
          </button>
        </div>

        {scheduledQuests.length === 0 ? (
          <p className="text-sm opacity-60">Belum ada quest dijadwalkan</p>
        ) : (
          <div className="space-y-2">
            {scheduledQuests.map((q) => (
              <div key={q.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-semibold">{q.quest_master.title}</p>
                  <p className="text-xs opacity-60">
                    {q.schedule_type} · {q.quest_master.exp_reward} EXP
                  </p>
                </div>
                <button onClick={() => toggleQuestStatus(q.id, q.is_active)} className={`rounded px-2 py-1 text-xs font-semibold ${q.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                  {q.is_active ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg bg-[#0A192F] border border-[#00F2FF] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#FFD700]">Jadwalkan Quest Baru</h3>

            {!selectedMaster ? (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {masterQuests.map((q) => (
                  <button key={q.id} onClick={() => setSelectedMaster(q)} className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:border-[#00F2FF]">
                    <p className="font-semibold">{q.title}</p>
                    <p className="text-xs opacity-60">
                      {q.mission_type} · {q.exp_reward} EXP
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSchedule} className="space-y-3">
                <div>
                  <p className="mb-2 font-semibold text-[#00F2FF]">{selectedMaster.title}</p>
                  <p className="text-xs opacity-60">{selectedMaster.description}</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm">Tipe Schedule</label>
                  <select value={formData.schedule_type} onChange={(e) => setFormData({...formData, schedule_type: e.target.value})} className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="once">One Time</option>
                  </select>
                </div>

                {selectedMaster.mission_type === 'daily_prayer' && (
                  <div>
                    <label className="mb-1 block text-sm">Jenis Sholat (opsional)</label>
                    <select value={formData.prayer_type} onChange={(e) => setFormData({...formData, prayer_type: e.target.value})} className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none">
                      <option value="">Semua Sholat</option>
                      <option value="fajr">Subuh</option>
                      <option value="dhuhr">Dzuhur</option>
                      <option value="asr">Ashar</option>
                      <option value="maghrib">Maghrib</option>
                      <option value="isha">Isya</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="submit" className="flex-1 rounded-lg bg-[#00F2FF] py-2 font-semibold text-[#0A192F]">
                    Jadwalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedMaster(null);
                    }}
                    className="flex-1 rounded-lg border border-white/20 py-2"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestMasterList({role}) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    const {data} = await supabase.from('quest_master').select('*').order('mission_type').order('title');
    setQuests(data || []);
    setLoading(false);
  };

  if (loading) return <p className="text-center text-sm opacity-70">Memuat...</p>;

  return (
    <div>
      <p className="mb-4 text-sm opacity-70">
        {role === 'quest_creator' || role === 'super_admin' ? 'Anda dapat mengelola quest master (fitur edit akan ditambahkan)' : 'Read-only view - hanya Quest Creator dan Super Admin yang dapat mengedit'}
      </p>

      <div className="space-y-2">
        {quests.map((q) => (
          <div key={q.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[#FFD700]">{q.title}</h3>
                <p className="text-sm opacity-80">{q.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-[#00F2FF]/20 px-2 py-1 text-[#00F2FF]">{q.mission_type}</span>
                  <span className="rounded bg-purple-500/20 px-2 py-1 text-purple-300">{q.parameter_category}</span>
                  <span className="rounded bg-green-500/20 px-2 py-1 text-green-300">{q.exp_reward} EXP</span>
                  <span className="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300">{q.validation_method}</span>
                </div>
              </div>
              {!q.is_active && <span className="ml-2 rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">Inactive</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
