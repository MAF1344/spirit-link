import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Loader2, FileText } from 'lucide-react';
import SubmissionCard from '../components/SubmissionCard';

export default function MySubmissionsPage({ session }) {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, [session.user.id]);

  useEffect(() => {
    applyFilter();
  }, [submissions, filterStatus]);

  const fetchSubmissions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('mission_submissions')
      .select(`
        id,
        submission_type,
        proof_url,
        notes,
        status,
        validated_at,
        rejection_reason,
        exp_awarded,
        submitted_at,
        dungeon_quests:dungeon_quest_id (
          quest_master:quest_master_id (
            title,
            exp_reward,
            mission_type
          )
        )
      `)
      .eq('player_id', session.user.id)
      .order('submitted_at', { ascending: false });

    if (error) {
      setError('Gagal memuat submissions: ' + error.message);
    } else {
      // Flatten the nested structure
      const flattenedData = data.map(item => ({
        ...item,
        quest_title: item.dungeon_quests?.quest_master?.title || 'Unknown Quest',
        exp_reward: item.dungeon_quests?.quest_master?.exp_reward || 0,
        mission_type: item.dungeon_quests?.quest_master?.mission_type || 'unknown'
      }));
      setSubmissions(flattenedData);
    }

    setLoading(false);
  };

  const applyFilter = () => {
    if (filterStatus === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter(s => s.status === filterStatus));
    }
  };

  const getStatusCount = (status) => {
    return submissions.filter(s => s.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#00F2FF] mx-auto mb-2" size={40} />
          <p className="text-[#00F2FF]">Memuat submissions...</p>
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
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">My Submissions</h1>
        <p className="text-gray-400">History dan status submission mission kamu</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{getStatusCount('pending')}</p>
          <p className="text-xs text-gray-400 mt-1">Pending</p>
        </div>
        <div className="bg-[#1a1a1a] border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{getStatusCount('approved')}</p>
          <p className="text-xs text-gray-400 mt-1">Approved</p>
        </div>
        <div className="bg-[#1a1a1a] border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{getStatusCount('rejected')}</p>
          <p className="text-xs text-gray-400 mt-1">Rejected</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-[#00F2FF]" />
          <span className="text-sm font-semibold text-[#00F2FF]">Filter by Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Semua', count: submissions.length },
            { value: 'pending', label: 'Pending', count: getStatusCount('pending') },
            { value: 'approved', label: 'Approved', count: getStatusCount('approved') },
            { value: 'rejected', label: 'Rejected', count: getStatusCount('rejected') }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterStatus === filter.value
                  ? 'bg-[#00F2FF] text-[#0A192F]'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-8 text-center">
          <FileText size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Kamu belum pernah submit mission apapun.</p>
          <Link 
            to="/missions" 
            className="inline-block bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] hover:from-[#00d9ff] hover:to-[#00c0e0] text-[#0A192F] font-bold py-2 px-6 rounded-lg transition-all"
          >
            Lihat Available Missions
          </Link>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-8 text-center">
          <p className="text-gray-400">Tidak ada submission dengan status ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}

      {/* Link to Missions */}
      <div className="mt-8 text-center">
        <Link 
          to="/missions" 
          className="inline-block text-[#FFD700] font-semibold hover:underline"
        >
          ← Kembali ke Available Missions
        </Link>
      </div>
    </div>
  );
}
