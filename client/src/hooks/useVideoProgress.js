import { useState, useEffect, useRef } from 'react';
import VideoTracker from '../utils/videoTracker';
import { useUser } from '../context/UserContext';

/**
 * Custom hook for tracking video progress
 * @param {string} videoId - ID of the video
 * @param {Object} videoRef - React ref to the video element
 * @param {Object} options - Additional options
 * @param {Function} options.onProgressUpdate - Callback for progress updates
 * @returns {Object} - Video progress state and functions
 */
const useVideoProgress = (videoId, videoRef, options = {}) => {
  const { user } = useUser();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialProgressLoaded, setInitialProgressLoaded] = useState(false);

  // Track last reported progress to avoid excessive API calls
  const lastReportedProgress = useRef(0);
  // Timer for periodic progress updates
  const progressTimer = useRef(null);

  // Load initial progress when component mounts
  useEffect(() => {
    const loadInitialProgress = async () => {
      if (!user || !videoId) return;

      try {
        setLoading(true);
        const history = await VideoTracker.getWatchHistory();
        const videoHistory = history.find(item => item.videoId._id === videoId);

        if (videoHistory && videoRef.current) {
          // Set initial progress
          const watchPercentage = videoHistory.watchPercentage;
          setProgress(watchPercentage);

          // Calculate time position based on percentage
          if (videoRef.current.duration) {
            const timePosition = (watchPercentage / 100) * videoRef.current.duration;
            videoRef.current.currentTime = timePosition;
            setCurrentTime(timePosition);
          }

          lastReportedProgress.current = watchPercentage;
        }

        setInitialProgressLoaded(true);
      } catch (err) {
        console.error('Error loading initial progress:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProgress();

    // Clean up timer on unmount
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [videoId, user]);

  // Set up video event listeners
  useEffect(() => {
    if (!videoRef.current || !videoId || !user) return;

    const video = videoRef.current;

    // Handle metadata loaded
    const handleMetadataLoaded = () => {
      setDuration(video.duration);

      // If we have initial progress and duration is now available, set the current time
      if (initialProgressLoaded && progress > 0) {
        const timePosition = (progress / 100) * video.duration;
        video.currentTime = timePosition;
        setCurrentTime(timePosition);
      }
    };

    // Handle time update
    const handleTimeUpdate = () => {
      const newCurrentTime = video.currentTime;
      const newProgress = (newCurrentTime / video.duration) * 100;

      setCurrentTime(newCurrentTime);
      setProgress(newProgress);

      // Call the progress update callback if provided
      if (options.onProgressUpdate) {
        options.onProgressUpdate(newProgress, newCurrentTime, video.duration);
      }

      // Report progress periodically or on significant changes
      const progressDiff = Math.abs(newProgress - lastReportedProgress.current);
      if (progressDiff >= 5) { // Report every 5% change
        reportProgress(newProgress);
        lastReportedProgress.current = newProgress;
      }
    };

    // Set up progress reporting timer (every 30 seconds)
    progressTimer.current = setInterval(() => {
      if (video.currentTime > 0 && progress > 0) {
        reportProgress(progress);
      }
    }, 30000);

    // Add event listeners
    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Clean up event listeners
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);

      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }

      // Report final progress on unmount
      if (progress > 0) {
        reportProgress(progress);
      }
    };
  }, [videoRef, videoId, user, initialProgressLoaded]);

  // Report progress to the server
  const reportProgress = async (currentProgress) => {
    if (!user || !videoId) return [];

    try {
      const result = await VideoTracker.trackProgress(videoId, currentProgress);

      // Return any new badges earned
      if (result && result.newBadges && result.newBadges.length > 0) {
        return result.newBadges;
      }

      return [];
    } catch (err) {
      console.error('Error reporting progress:', err);
      // Don't set error state to avoid disrupting user experience
      return [];
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek to a specific time
  const seekTo = (percentage) => {
    if (!videoRef.current || !duration) return;

    const newTime = (percentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  // Get the watch status based on progress
  const getWatchStatus = (currentProgress = progress) => {
    if (currentProgress >= 90) {
      return 'completed';
    } else if (currentProgress > 0) {
      return 'in-progress';
    } else {
      return 'not-started';
    }
  };

  return {
    progress,
    duration,
    currentTime,
    loading,
    error,
    formatTime,
    seekTo,
    reportProgress,
    getWatchStatus
  };
};

export default useVideoProgress;
