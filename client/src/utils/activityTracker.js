import customFetch from './customFetch';

/**
 * Utility for tracking user activity and interactions
 */
class ActivityTracker {
  /**
   * Track a user viewing content
   * @param {string} contentType - Type of content (post, article, video, podcast, question, answer)
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   * @param {Object} metadata - Additional metadata about the view
   */
  static async trackView(contentType, contentId, contentModel, metadata = {}) {
    try {
      await this._trackActivity('view', contentType, contentId, contentModel, metadata);
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't throw error to prevent disrupting user experience
    }
  }

  /**
   * Track a user liking content
   * @param {string} contentType - Type of content
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   */
  static async trackLike(contentType, contentId, contentModel) {
    try {
      await this._trackActivity('like', contentType, contentId, contentModel);
    } catch (error) {
      console.error('Error tracking like:', error);
    }
  }

  /**
   * Track a user commenting on content
   * @param {string} contentType - Type of content
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   */
  static async trackComment(contentType, contentId, contentModel) {
    try {
      await this._trackActivity('comment', contentType, contentId, contentModel);
    } catch (error) {
      console.error('Error tracking comment:', error);
    }
  }

  /**
   * Track time spent on content
   * @param {string} contentType - Type of content
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   * @param {number} timeSpent - Time spent in seconds
   */
  static async trackTimeSpent(contentType, contentId, contentModel, timeSpent) {
    try {
      await this._trackActivity('time_spent', contentType, contentId, contentModel, { timeSpent });
    } catch (error) {
      console.error('Error tracking time spent:', error);
    }
  }

  /**
   * Track video/podcast completion
   * @param {string} contentType - Type of content (video or podcast)
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   * @param {number} completionPercentage - Percentage of content completed (0-100)
   */
  static async trackCompletion(contentType, contentId, contentModel, completionPercentage) {
    try {
      await this._trackActivity('complete', contentType, contentId, contentModel, { completionPercentage });
    } catch (error) {
      console.error('Error tracking completion:', error);
    }
  }

  /**
   * Track search queries
   * @param {string} searchQuery - The search query
   */
  static async trackSearch(searchQuery) {
    try {
      await this._trackActivity('search', 'search', new Date().getTime().toString(), 'Search', { searchQuery });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  /**
   * Track clicking on a recommendation
   * @param {string} recommendationId - ID of the recommendation
   * @param {string} contentType - Type of content
   * @param {string} contentId - ID of the content
   * @param {string} contentModel - Model name of the content
   */
  static async trackRecommendationClick(recommendationId, contentType, contentId, contentModel) {
    try {
      // First mark the recommendation as clicked
      await customFetch.post(`/analytics/recommendations/clicked/${recommendationId}`);
      
      // Then track the click activity
      await this._trackActivity('click', contentType, contentId, contentModel, { 
        recommendationId,
        referrer: 'recommendation'
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  }

  /**
   * Get personalized recommendations
   * @param {string} contentType - Optional content type filter
   * @param {number} limit - Number of recommendations to get
   * @returns {Promise<Array>} - Array of recommendations
   */
  static async getRecommendations(contentType = null, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (contentType) params.append('contentType', contentType);
      if (limit) params.append('limit', limit);
      
      const response = await customFetch.get(`/analytics/recommendations?${params.toString()}`);
      return response.data.recommendations || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Get popular content
   * @param {string} contentType - Type of content
   * @param {number} timeframe - Timeframe in days
   * @param {number} limit - Number of items to get
   * @returns {Promise<Array>} - Array of popular content
   */
  static async getPopularContent(contentType, timeframe = 7, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('contentType', contentType);
      params.append('timeframe', timeframe);
      params.append('limit', limit);
      
      const response = await customFetch.get(`/analytics/popular?${params.toString()}`);
      return response.data.popularContent || [];
    } catch (error) {
      console.error('Error getting popular content:', error);
      return [];
    }
  }

  /**
   * Private method to track activity
   * @private
   */
  static async _trackActivity(activityType, contentType, contentId, contentModel, metadata = {}) {
    // Only track if user is logged in
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Add device and referrer info to metadata
    metadata.device = this._getDeviceType();
    metadata.referrer = document.referrer || window.location.pathname;
    
    // Get session ID from localStorage or create a new one
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this._generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    
    // Send tracking data to server
    await customFetch.post('/analytics/track', {
      activityType,
      contentType,
      contentId,
      contentModel,
      metadata,
      sessionId
    });
  }

  /**
   * Get device type
   * @private
   */
  static _getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet/i.test(userAgent) || /ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Generate a session ID
   * @private
   */
  static _generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export default ActivityTracker;
