import customFetch from './customFetch';
import ActivityTracker from './activityTracker';

/**
 * Utility for tracking video progress and getting recommendations
 */
class VideoTracker {
  /**
   * Track video progress
   * @param {string} videoId - ID of the video
   * @param {number} watchPercentage - Percentage of video watched (0-100)
   * @returns {Promise} - Promise that resolves with the watch history and achievement data
   */
  static async trackProgress(videoId, watchPercentage) {
    try {
      console.log(`Tracking progress for video ${videoId}: ${watchPercentage}%`);

      // Ensure watchPercentage is a valid number
      const percentage = parseFloat(watchPercentage) || 0;

      // Determine video status based on progress
      let status = 'not-started';
      if (percentage >= 90) {
        status = 'completed';
      } else if (percentage > 0) {
        status = 'in-progress';
      }

      // Log warning if percentage is not a valid number
      if (isNaN(watchPercentage)) {
        console.warn('Invalid watchPercentage value:', watchPercentage);
      }

      const { data } = await customFetch.post('/videos/track-progress', {
        videoId,
        watchPercentage: percentage, // Use validated percentage
        status // Send status to backend
      });

      // Log the response for debugging
      console.log(`Progress tracking response: ${data.status} (${watchPercentage}%)`);

      // If this is the first interaction (near the beginning), mark as "in progress"
      if (watchPercentage > 0 && watchPercentage < 5) {
        console.log('Video marked as in progress');
      }

      // Also track completion through activity tracker if watched more than 90%
      if (watchPercentage >= 90) {
        console.log('Video marked as completed');
        await ActivityTracker.trackCompletion('video', videoId, 'Video', watchPercentage);

        // Update video watched achievement - pass videoId to check if it's a rewatch
        try {
          const achievementResponse = await customFetch.post('/video-achievements/video-watched', {
            videoId
          });

          // Return both watch history and achievement data
          return {
            watchHistory: data.watchHistory,
            newBadges: achievementResponse.data.newBadges || []
          };
        } catch (achievementError) {
          console.error('Error updating video achievement:', achievementError);
          return {
            watchHistory: data.watchHistory,
            newBadges: []
          };
        }
      }

      return {
        watchHistory: data.watchHistory,
        newBadges: []
      };
    } catch (error) {
      console.error('Error tracking video progress:', error);

      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }

      // Return a default response
      return {
        watchHistory: null,
        newBadges: [],
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get user's video watch history
   * @param {number} limit - Maximum number of items to return
   * @param {string} status - Filter by status ('all', 'completed', 'in-progress', 'not-started')
   * @returns {Promise} - Promise that resolves with the watch history
   */
  static async getWatchHistory(limit = 20, status = 'all') {
    try {
      const { data } = await customFetch.get('/videos/watch-history', {
        params: { limit, status }
      });
      return data.watchHistory;
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }

  /**
   * Get videos by status
   * @param {string} status - Status to filter by ('completed', 'in-progress', 'not-started')
   * @param {number} limit - Maximum number of items to return
   * @returns {Promise} - Promise that resolves with the filtered videos
   */
  static async getVideosByStatus(status, limit = 20) {
    return this.getWatchHistory(limit, status);
  }

  /**
   * Get user's in-progress videos
   * @param {number} limit - Maximum number of items to return
   * @returns {Promise} - Promise that resolves with in-progress videos
   */
  static async getInProgressVideos(limit = 10) {
    try {
      const { data } = await customFetch.get('/videos/in-progress', {
        params: { limit }
      });
      return data.inProgressVideos;
    } catch (error) {
      console.error('Error getting in-progress videos:', error);
      return [];
    }
  }

  /**
   * Get video recommendations
   * @param {string} videoId - ID of the current video
   * @param {number} limit - Maximum number of recommendations to return
   * @returns {Promise} - Promise that resolves with recommendations
   */
  static async getRecommendations(videoId, limit = 10) {
    try {
      const { data } = await customFetch.get('/videos/recommendations', {
        params: { videoId, limit }
      });
      return data.recommendations;
    } catch (error) {
      console.error('Error getting video recommendations:', error);
      return [];
    }
  }

  /**
   * Check if a playlist is completed
   * @param {string} playlistId - ID of the playlist
   * @returns {Promise} - Promise that resolves with completion status and badges
   */
  static async checkPlaylistCompletion(playlistId) {
    try {
      const { data } = await customFetch.get(`/video-achievements/check-playlist/${playlistId}`);
      return data;
    } catch (error) {
      console.error('Error checking playlist completion:', error);
      return {
        isCompleted: false,
        completedVideos: 0,
        totalVideos: 0,
        newBadges: []
      };
    }
  }

  /**
   * Get user's video achievements
   * @returns {Promise} - Promise that resolves with achievements
   */
  static async getUserAchievements() {
    try {
      const { data } = await customFetch.get('/video-achievements');
      return data.achievements;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return {
        videosWatched: { count: 0 },
        playlistsCompleted: { count: 0, playlists: [] },
        watchStreak: { current: 0, longest: 0 },
        badges: []
      };
    }
  }

  /**
   * Get user's unseen badges
   * @returns {Promise} - Promise that resolves with unseen badges
   */
  static async getUnseenBadges() {
    try {
      const { data } = await customFetch.get('/video-achievements/unseen-badges');
      return data.badges;
    } catch (error) {
      console.error('Error getting unseen badges:', error);
      return [];
    }
  }

  /**
   * Mark badges as seen
   * @returns {Promise} - Promise that resolves when badges are marked as seen
   */
  static async markBadgesAsSeen() {
    try {
      await customFetch.post('/video-achievements/mark-badges-seen');
      return true;
    } catch (error) {
      console.error('Error marking badges as seen:', error);
      return false;
    }
  }

  /**
   * Get badge details
   * @returns {Promise} - Promise that resolves with badge details
   */
  static async getBadgeDetails() {
    try {
      const { data } = await customFetch.get('/video-achievements/badge-details');
      return data.badgeDetails;
    } catch (error) {
      console.error('Error getting badge details:', error);
      return {};
    }
  }
}

export default VideoTracker;
