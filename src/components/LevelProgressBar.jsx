export default function LevelProgressBar({ currentExp, currentLevel }) {
  const getExpForLevel = (level) => {
    if (level <= 10) return (level - 1) * 100;
    if (level <= 25) return 1000 + ((level - 10) * 250);
    if (level <= 50) return 4750 + ((level - 25) * 500);
    if (level <= 75) return 17250 + ((level - 50) * 1000);
    if (level <= 100) return 42250 + ((level - 75) * 2000);
    return 92250;
  };

  const getExpForNextLevel = (currentLevel) => {
    if (currentLevel >= 100) return 0; // Max level
    return getExpForLevel(currentLevel + 1) - getExpForLevel(currentLevel);
  };

  const currentLevelMinExp = getExpForLevel(currentLevel);
  const nextLevelMinExp = getExpForLevel(currentLevel + 1);
  const expInCurrentLevel = currentExp - currentLevelMinExp;
  const expNeededForNext = nextLevelMinExp - currentLevelMinExp;
  const progressPercentage = currentLevel >= 100 ? 100 : (expInCurrentLevel / expNeededForNext) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative w-full h-8 bg-[#1a1a1a] border border-[#00F2FF]/30 rounded-lg overflow-hidden">
        {/* Fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00F2FF] to-[#00d9ff] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Text overlay */}
        <div className="relative h-full flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {currentLevel >= 100 ? (
              'MAX LEVEL'
            ) : (
              <>
                {expInCurrentLevel.toLocaleString()} / {expNeededForNext.toLocaleString()} EXP
              </>
            )}
          </span>
        </div>
      </div>

      {/* Info below */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>Level {currentLevel}</span>
        <span>{Math.floor(progressPercentage)}% to next level</span>
        {currentLevel < 100 && <span>Level {currentLevel + 1}</span>}
      </div>
    </div>
  );
}
