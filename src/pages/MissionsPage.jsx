import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Loader2 } from 'lucide-react';
import QuestCard from '../components/QuestCard';
import SubmissionModal from '../components/SubmissionModal';

export default function MissionsPage({ session }) {
  const [quests, setQuests] = useState([]);
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerDungeonId, setPlayerDungeonId] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterSchedule, setFilterSchedule] = useState('all');

  useEffect(() => {
    fetchPlayerDungeon();
  }, [session.user.id]);

  useEffect(() => {
    if (playerDungeonId) {
      fetchQuests();
    }
  }, [playerDungeonId]);

  useEffect(() => {
    applyFilter();
  }, [quests, filterSchedule]);

  const fetchPlayerDungeon = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('dungeon_id')
      .eq('id', session.user.id)
      .single();

    if (error) {
      setError('Gagal memuat data player: ' + error.message);
      setLoading(false);
    } else if (!data.dungeon_id) {
      setError('Kamu belum terdaftar di dungeon manapun. Hubungi admin.');
      setLoading(false);
    } else {
      setPlayerDungeonId(data.dungeon_id);
    }
  };

  const fetchQuests = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('dungeon_quests')
      .select(`
        id,
        prayer_type,
        schedule_type,
        is_active,
        quest_master:quest_master_id (
          title,
          description,
          mission_type,
          exp_reward,
          parameter_category,
          validation_method,
          requires_proof
        )
      `)
      .eq('dungeon_id', playerDungeonId)
      .eq('is_active', true);

    if (error) {
      setError('Gagal memuat quests: ' + error.message);
    } else {
      // Check which quests already submitted today
      const questsWithSubmissionStatus = await Promise.all(
        data.map(async (quest) => {
          const { data: submissions } = await supabase
            .from('mission_submissions')
            .select('id')
            .eq('player_id', session.user.id)
            .eq('dungeon_quest_id', quest.id)
            .gte('submitted_at', new Date().toISOString().split('T')[0])
            .limit(1);

          return {
            dungeon_quest_id: quest.id,
            prayer_type: quest.prayer_type,
            schedule_type: quest.schedule_type,
            title: quest.quest_master.title,
            description: quest.quest_master.description,
            mission_type: quest.quest_master.mission_type,
            exp_reward: quest.quest_master.exp_reward,
            parameter_category: quest.quest_master.parameter_category,
            validation_method: quest.quest_master.validation_method,
            requires_proof: quest.quest_master.requires_proof,
            submitted_today: submissions && submissions.length > 0
          };
        })
      );

      setQuests(questsWithSubmissionStatus);
    }

    setLoading(false);
  };

  const applyFilter = () => {
    if (filterSchedule === 'all') {
      setFilteredQuests(quests);
    } else {
      setFilteredQuests(quests.filter(q => q.schedule_type === filterSchedule));
    }
  };

  const handleSubmitQuest = (quest) => {
    setSelectedQuest(quest);
  };

  const handleCloseModal = () => {
    setSelectedQuest(null);
  };

  const handleSubmitMission = async (formData) => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from('mission_submissions')
      .insert({
        player_id: session.user.id,
        dungeon_quest_id: selectedQuest.dungeon_quest_id,
        dungeon_id: playerDungeonId,
        submission_type: formData.submission_type,
        proof_url: formData.proof_url,
        notes: formData.notes,
        status: 'pending'
      });

    setIsSubmitting(false);

    if (error) {
      alert('Gagal submit mission: ' + error.message);
    } else {
      alert('Mission berhasil di-submit! Tunggu validasi dari GM.');
      setSelectedQuest(null);
      fetchQuests(); // Refresh list
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#00F2FF] mx-auto mb-2" size={40} />
          <p className="text-[#00F2FF]">Memuat missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A192F] p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00F2FF] mb-4">
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] p-6">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00F2FF] mb-4 hover:underline">
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">Available Missions</h1>
        <p className="text-gray-400">Pilih mission dan submit untuk mendapatkan EXP</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-[#00F2FF]" />
          <span className="text-sm font-semibold text-[#00F2FF]">Filter by Schedule:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Semua' },
            { value: 'daily', label: 'Harian' },
            { value: 'weekly', label: 'Mingguan' },
            { value: 'monthly', label: 'Bulanan' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterSchedule(filter.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterSchedule === filter.value
                  ? 'bg-[#00F2FF] text-[#0A192F]'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quest List */}
      {filteredQuests.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-8 text-center">
          <p className="text-gray-400">Tidak ada mission tersedia untuk filter ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuests.map((quest, index) => (
            <QuestCard 
              key={index} 
              quest={quest} 
              onSubmit={handleSubmitQuest}
            />
          ))}
        </div>
      )}

      {/* Link to My Submissions */}
      <div className="mt-8 text-center">
        <Link 
          to="/my-submissions" 
          className="inline-block text-[#FFD700] font-semibold hover:underline"
        >
          Lihat Submission Saya →
        </Link>
      </div>

      {/* Submission Modal */}
      {selectedQuest && (
        <SubmissionModal
          quest={selectedQuest}
          onClose={handleCloseModal}
          onSubmit={handleSubmitMission}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
