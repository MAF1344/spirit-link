const RANK_INFO = {
  Seeker: {
    color: 'gray',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500',
    description: 'Starting rank. A hero searching for light amidst The Void.',
    levelRange: '1-9'
  },
  Acolyte: {
    color: 'silver',
    bgColor: 'bg-slate-400/20',
    textColor: 'text-slate-300',
    borderColor: 'border-slate-400',
    description: 'Committed to routine sanctuary missions.',
    levelRange: '10-24'
  },
  Guardian: {
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    description: 'True protectors of the Sanctuary.',
    levelRange: '25-39'
  },
  Warden: {
    color: 'purple',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    description: 'Leaders of Dungeon Raids. Can act as raid leaders.',
    levelRange: '40-49'
  },
  Exalted: {
    color: 'gold',
    bgColor: 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFC700]/20',
    textColor: 'text-[#FFD700]',
    borderColor: 'border-[#FFD700]',
    description: 'Legends whose spiritual activity holds back the Doom Meter.',
    levelRange: '50+'
  }
};

export default function RankBadge({ level, showDescription = false, size = 'md' }) {
  const getRankFromLevel = (level) => {
    if (level >= 50) return 'Exalted';
    if (level >= 40) return 'Warden';
    if (level >= 25) return 'Guardian';
    if (level >= 10) return 'Acolyte';
    return 'Seeker';
  };

  const rank = getRankFromLevel(level);
  const rankInfo = RANK_INFO[rank];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className="inline-block">
      <div className={`
        inline-flex items-center gap-2 rounded-full font-bold border
        ${rankInfo.bgColor} ${rankInfo.textColor} ${rankInfo.borderColor}
        ${sizeClasses[size]}
      `}>
        <span className={`inline-block w-2 h-2 rounded-full ${rankInfo.color === 'gold' ? 'bg-[#FFD700]' : `bg-${rankInfo.color}-400`} animate-pulse`} />
        {rank}
      </div>
      
      {showDescription && (
        <div className="mt-2 text-xs text-gray-400">
          <p>{rankInfo.description}</p>
          <p className="text-gray-500 mt-1">Level {rankInfo.levelRange}</p>
        </div>
      )}
    </div>
  );
}

export { RANK_INFO };
