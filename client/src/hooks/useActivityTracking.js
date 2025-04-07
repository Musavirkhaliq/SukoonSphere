import { useEffect, useRef } from 'react';
import ActivityTracker from '../utils/activityTracker';
import { useUser } from '../context/UserContext';

/**
 * Hook for tracking user activity on content pages
 * 
 * @param {string} contentType - Type of content (post, article, video, podcast, question, answer)
 * @param {string} contentId - ID of the content
 * @param {string} contentModel - Model name of the content
 * @param {Object} metadata - Additional metadata about the content
 * @returns {Object} - Tracking methods
 */
const useActivityTracking = (contentType, contentId, contentModel, metadata = {}) => {
  const { user } = useUser();
  const startTimeRef = useRef(Date.now());
  const isTrackedRef = useRef(false);
  const intervalRef = useRef(null);
  
  // Track view when component mounts
  useEffect(() => {
    // Only track if user is logged in and content info is provided
    if (user && contentId && contentType && contentModel && !isTrackedRef.current) {
      // Track the view
      ActivityTracker.trackView(contentType, contentId, contentModel, metadata);
      isTrackedRef.current = true;
      
      // Start tracking time spent
      startTimeRef.current = Date.now();
      
      // Set up interval to track time spent every 30 seconds
      intervalRef.current = setInterval(() => {
        const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpentSeconds > 5) { // Only track if more than 5 seconds
          ActivityTracker.trackTimeSpent(contentType, contentId, contentModel, timeSpentSeconds);
          // Reset start time
          startTimeRef.current = Date.now();
        }
      }, 30000); // 30 seconds
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        
        // Track final time spent
        if (user && contentId && isTrackedRef.current) {
          const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          if (timeSpentSeconds > 5) {
            ActivityTracker.trackTimeSpent(contentType, contentId, contentModel, timeSpentSeconds);
          }
        }
      }
    };
  }, [user, contentId, contentType, contentModel, metadata]);
  
  // Track like
  const trackLike = () => {
    if (user && contentId) {
      ActivityTracker.trackLike(contentType, contentId, contentModel);
    }
  };
  
  // Track comment
  const trackComment = () => {
    if (user && contentId) {
      ActivityTracker.trackComment(contentType, contentId, contentModel);
    }
  };
  
  // Track completion (for videos/podcasts)
  const trackCompletion = (completionPercentage) => {
    if (user && contentId) {
      ActivityTracker.trackCompletion(contentType, contentId, contentModel, completionPercentage);
    }
  };
  
  return {
    trackLike,
    trackComment,
    trackCompletion
  };
};

export default useActivityTracking;
