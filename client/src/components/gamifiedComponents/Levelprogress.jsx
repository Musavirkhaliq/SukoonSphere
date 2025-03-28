import React from 'react';

const LevelProgress = ({ data }) => {
  // Define level thresholds
  const levelThresholds = [
    { name: "Self-Aware", minProgress: 0 },
    { name: "Resilient", minProgress: 25 },
    { name: "Empowered", minProgress: 50 },
    { name: "Flourishing", minProgress: 75 }
  ];

  // Calculate overall progress
  const calculateProgress = () => {
    const totalTasks = data.progress?.completed?.length + data.progress?.pending?.length;
    const completedTasksCount = data.progress?.completed?.length;

    return totalTasks > 0
      ? (completedTasksCount / totalTasks) * 100
      : 0;
  };

  // Determine current level based on progress
  const getCurrentLevel = (progress) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (progress >= levelThresholds[i].minProgress) {
        return {
          ...levelThresholds[i],
          currentProgress: progress,
          nextLevel: i < levelThresholds.length - 1 ? levelThresholds[i + 1] : null
        };
      }
    }

    return levelThresholds[0];
  };

  const overallProgress = calculateProgress();
  const currentLevel = getCurrentLevel(overallProgress);

  return (
    <div className="mt-4 grid grid-cols-4 gap-2 text-center">
      {levelThresholds.map((level) => (
        <div
          key={level.name}
          className={`p-2 rounded-lg ${currentLevel.name === level.name
            ? "bg-purple-100"
            : "bg-gray-100"
            }`}
        >
          <span className="block text-sm font-medium">
            {level.name}
          </span>
          <span className="text-xs text-gray-500">
            {level.minProgress}%+
          </span>
        </div>
      ))}

      <div className="col-span-4 mt-2 bg-gray-50 p-2 rounded-lg">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[var(--primary)] h-2.5 rounded-full"
            style={{
              width: `${Math.min(overallProgress, 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;