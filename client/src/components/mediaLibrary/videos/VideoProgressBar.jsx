import React from 'react';

const VideoProgressBar = ({ 
  progress, 
  currentTime, 
  duration, 
  formatTime, 
  onSeek,
  showPercentage = true
}) => {
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / progressBar.offsetWidth;
    const newPercentage = clickPosition * 100;
    
    if (onSeek) {
      onSeek(newPercentage);
    }
  };

  return (
    <div className="w-full space-y-1">
      {/* Progress Bar */}
      <div 
        className="h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Time and Percentage Display */}
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>{formatTime(currentTime)}</span>
        {showPercentage && (
          <span className="text-[var(--primary)] font-medium">
            {Math.round(progress)}%
          </span>
        )}
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VideoProgressBar;
