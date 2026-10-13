import { Award, CheckCircle } from 'lucide-react';

export default function QuestCard({ quest, onSubmit }) {
  const { 
    title, 
    description, 
    exp_reward, 
    mission_type, 
    parameter_category,
    validation_method,
    schedule_type,
    submitted_today 
  } = quest;

  const missionTypeColors = {
    daily_prayer: 'bg-cyan-500/20 text-cyan-400',
    quran_reading: 'bg-purple-500/20 text-purple-400',
    community_service: 'bg-green-500/20 text-green-400',
    learning_quiz: 'bg-blue-500/20 text-blue-400',
    group_mission: 'bg-pink-500/20 text-pink-400',
    special_event: 'bg-orange-500/20 text-orange-400'
  };

  const scheduleTypeLabels = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    once: 'Sekali'
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg p-4 hover:border-[#00F2FF]/60 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-[#FFD700] flex-1">{title}</h3>
        <div className="flex items-center gap-1 text-[#FFD700] ml-2">
          <Award size={16} />
          <span className="font-bold">{exp_reward}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">{description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${missionTypeColors[mission_type] || 'bg-gray-500/20 text-gray-400'}`}>
          {mission_type?.replace('_', ' ')}
        </span>
        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-500/20 text-purple-400">
          {parameter_category?.replace('_', ' ')}
        </span>
        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400">
          {validation_method?.replace('_', ' ')}
        </span>
        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">
          {scheduleTypeLabels[schedule_type] || schedule_type}
        </span>
      </div>

      {/* Submit Button */}
      {submitted_today ? (
        <div className="flex items-center gap-2 text-green-400 justify-center py-2">
          <CheckCircle size={18} />
          <span className="text-sm font-semibold">Sudah Submit Hari Ini</span>
        </div>
      ) : (
        <button
          onClick={() => onSubmit(quest)}
          className="w-full bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] hover:from-[#00d9ff] hover:to-[#00c0e0] text-[#0A192F] font-bold py-2 px-4 rounded-lg transition-all"
        >
          Submit Mission
        </button>
      )}
    </div>
  );
}
