import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Loader2, BookOpen, Users, GraduationCap, Heart } from 'lucide-react';
import { CLASS_INFO } from '../components/ClassCard';
import RankBadge from '../components/RankBadge';
import LevelProgressBar from '../components/LevelProgressBar';
import { QRCodeSVG } from 'qrcode.react';

const CLASS_ICONS = {
  quran_protector: BookOpen,
  dai: Users,
  scholar: GraduationCap,
  mumin: Heart
};

export default function CharacterPage({ session }) {
  const [player, setPlayer] = useState(null);
  const [missionStats, setMissionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayerData();
    fetchMissionStats();
  }, [session.user.id]);

  const fetchPlayerData = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      setError('Gagal memuat data player: ' + error.message);
    } else {
      setPlayer(data);
    }
    setLoading(false);
  };

  const fetchMissionStats = async () => {
    // Get mission stats breakdown by parameter_category
    const { data, error } = await supabase
      .from('mission_submissions')
      .select(`
        id,
        status,
        dungeon_quests:dungeon_quest_id (
          quest_master:quest_master_id (
            parameter_category
          )
        )
      `)
      .eq('player_id', session.user.id)
      .eq('status', 'approved');

    if (!error && data) {
      const stats = {
        mandatory_worship: 0,
        sunnah_devotion: 0,
        quranic_literacy: 0,
        seekers_insight: 0,
        dawah_outreach: 0
      };

      data.forEach(submission => {
        const category = submission.dungeon_quests?.quest_master?.parameter_category;
        if (category && stats.hasOwnProperty(category)) {
          stats[category]++;
        }
      });

      setMissionStats(stats);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#00F2FF] mx-auto mb-2" size={40} />
          <p className="text-[#00F2FF]">Memuat character data...</p>
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

  if (!player) return null;

  const classInfo = player.character_class ? CLASS_INFO[player.character_class] : null;
  const ClassIcon = player.character_class ? CLASS_ICONS[player.character_class] : null;

  return (
    <div className="min-h-screen bg-[#0A192F] p-6">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00F2FF] mb-4 hover:underline">
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">Character Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Profile Card */}
        <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-6">
          {/* Hero Name */}
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
            {player.hero_name}
          </h2>

          {/* Class Display */}
          {classInfo && ClassIcon && (
            <div className={`bg-gradient-to-br ${classInfo.bgGradient} border ${classInfo.borderColor} rounded-lg p-4 mb-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${classInfo.bgGradient} flex items-center justify-center`}>
                  <ClassIcon size={24} className={classInfo.textColor} />
                </div>
                <div>
                  <p className={`font-bold ${classInfo.textColor}`}>{classInfo.name}</p>
                  <p className="text-xs text-gray-300">{classInfo.specialty}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-300 mb-1">Class Bonus:</p>
                <p className={`text-sm font-semibold ${classInfo.textColor}`}>{classInfo.bonus}</p>
              </div>
            </div>
          )}

          {!player.character_class && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 text-center">
              <p className="text-yellow-400 font-semibold mb-2">No Class Selected</p>
              <p className="text-xs text-gray-300">You will be prompted to select a class on next login</p>
            </div>
          )}

          {/* Level and Rank */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Level</p>
              <p className="text-3xl font-bold text-[#00F2FF]">{player.level}</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Rank</p>
              <RankBadge level={player.level} size="lg" />
            </div>
          </div>

          {/* Progress Bar */}
          <LevelProgressBar currentExp={player.total_exp} currentLevel={player.level} />

          {/* Total EXP */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Award size={20} className="text-[#FFD700]" />
              <span className="text-lg font-bold text-white">
                {player.total_exp.toLocaleString()} Total EXP
              </span>
            </div>
          </div>
        </div>

        {/* Mission Stats */}
        {missionStats && (
          <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-4">Mission Statistics</h3>
            <div className="space-y-3">
              <StatRow 
                label="Mandatory Worship" 
                value={missionStats.mandatory_worship}
                isClassSpecialty={false}
              />
              <StatRow 
                label="Sunnah Devotion" 
                value={missionStats.sunnah_devotion}
                isClassSpecialty={false}
              />
              <StatRow 
                label="Quranic Literacy" 
                value={missionStats.quranic_literacy}
                isClassSpecialty={player.character_class === 'quran_protector'}
              />
              <StatRow 
                label="Seeker's Insight" 
                value={missionStats.seekers_insight}
                isClassSpecialty={player.character_class === 'scholar'}
              />
              <StatRow 
                label="Dawah Outreach" 
                value={missionStats.dawah_outreach}
                isClassSpecialty={player.character_class === 'dai'}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                Total Missions Completed: <span className="font-bold text-[#00F2FF]">
                  {Object.values(missionStats).reduce((a, b) => a + b, 0)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* QR Code Card */}
        <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4 text-center">Check-In QR Code</h3>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={player.qr_id} size={200} />
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3 break-all">{player.qr_id}</p>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, isClassSpecialty }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-300">
        {label}
        {isClassSpecialty && (
          <span className="ml-2 text-xs text-[#FFD700]">⭐ Class Specialty</span>
        )}
      </span>
      <span className={`font-bold ${isClassSpecialty ? 'text-[#FFD700]' : 'text-[#00F2FF]'}`}>
        {value}
      </span>
    </div>
  );
}
