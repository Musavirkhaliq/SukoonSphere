import UserActivity from "../models/analytics/userActivityModel.js";
import UserPreference from "../models/analytics/userPreferenceModel.js";

// Middleware to track content views
export const trackContentView = async (req, res, next) => {
  try {
    // Only track for authenticated users
    if (!req.user || !req.user.userId) {
      return next();
    }

    const { userId } = req.user;
    const { id: contentId } = req.params;
    
    // Determine content type and model based on route
    let contentType, contentModel;
    
    if (req.originalUrl.includes('/posts/')) {
      contentType = 'post';
      contentModel = 'Post';
    } else if (req.originalUrl.includes('/articles/')) {
      contentType = 'article';
      contentModel = 'ArticleModel';
    } else if (req.originalUrl.includes('/videos/')) {
      contentType = 'video';
      contentModel = 'Video';
    } else if (req.originalUrl.includes('/podcasts/')) {
      contentType = 'podcast';
      contentModel = 'Podcast';
    } else if (req.originalUrl.includes('/qa-section/questions/')) {
      contentType = 'question';
      contentModel = 'Question';
    } else if (req.originalUrl.includes('/qa-section/answers/')) {
      contentType = 'answer';
      contentModel = 'Answer';
    } else {
      // If route doesn't match any content type, skip tracking
      return next();
    }
    
    // Get session ID from cookies or create a new one
    const sessionId = req.cookies.sessionId || generateSessionId();
    
    // Set session ID cookie if not exists
    if (!req.cookies.sessionId) {
      res.cookie('sessionId', sessionId, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
      });
    }
    
    // Log the view activity asynchronously (don't wait for it to complete)
    UserActivity.logActivity(
      userId,
      'view',
      contentType,
      contentId,
      contentModel,
      {
        referrer: req.headers.referer || '',
        device: getDeviceType(req.headers['user-agent'])
      },
      sessionId
    ).then(activity => {
      if (activity) {
        // Get creator ID based on content type and model
        let creatorId = null;
        
        // This will be handled by the model's updatePreferences method
        UserPreference.updatePreferences(userId, {
          activityType: 'view',
          contentType,
          contentId,
          metadata: {
            referrer: req.headers.referer || '',
            device: getDeviceType(req.headers['user-agent'])
          }
        }).catch(err => {
          console.error('Error updating user preferences:', err);
        });
      }
    }).catch(err => {
      console.error('Error logging view activity:', err);
    });
    
    // Continue with the request
    next();
  } catch (error) {
    console.error('Error in trackContentView middleware:', error);
    // Don't block the request if tracking fails
    next();
  }
};

// Middleware to track search queries
export const trackSearchQuery = async (req, res, next) => {
  try {
    // Only track for authenticated users
    if (!req.user || !req.user.userId) {
      return next();
    }

    const { userId } = req.user;
    const { q, query } = req.query;
    const searchQuery = q || query;
    
    if (!searchQuery) {
      return next();
    }
    
    // Get session ID from cookies or create a new one
    const sessionId = req.cookies.sessionId || generateSessionId();
    
    // Set session ID cookie if not exists
    if (!req.cookies.sessionId) {
      res.cookie('sessionId', sessionId, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
      });
    }
    
    // Log the search activity asynchronously
    UserActivity.logActivity(
      userId,
      'search',
      'search',
      new mongoose.Types.ObjectId(), // Generate a dummy ID for search
      'Search',
      {
        searchQuery,
        referrer: req.headers.referer || '',
        device: getDeviceType(req.headers['user-agent'])
      },
      sessionId
    ).catch(err => {
      console.error('Error logging search activity:', err);
    });
    
    // Continue with the request
    next();
  } catch (error) {
    console.error('Error in trackSearchQuery middleware:', error);
    // Don't block the request if tracking fails
    next();
  }
};

// Middleware to track time spent on content
export const trackTimeSpent = async (req, res, next) => {
  try {
    // Only track for authenticated users
    if (!req.user || !req.user.userId) {
      return next();
    }

    const { userId } = req.user;
    const { contentId, contentType, timeSpent } = req.body;
    
    if (!contentId || !contentType || !timeSpent) {
      return next();
    }
    
    // Determine content model based on content type
    let contentModel;
    switch (contentType) {
      case 'post':
        contentModel = 'Post';
        break;
      case 'article':
        contentModel = 'ArticleModel';
        break;
      case 'video':
        contentModel = 'Video';
        break;
      case 'podcast':
        contentModel = 'Podcast';
        break;
      case 'question':
        contentModel = 'Question';
        break;
      case 'answer':
        contentModel = 'Answer';
        break;
      default:
        return next();
    }
    
    // Get session ID from cookies or create a new one
    const sessionId = req.cookies.sessionId || generateSessionId();
    
    // Log the time spent activity asynchronously
    UserActivity.logActivity(
      userId,
      'time_spent',
      contentType,
      contentId,
      contentModel,
      {
        timeSpent: parseInt(timeSpent),
        referrer: req.headers.referer || '',
        device: getDeviceType(req.headers['user-agent'])
      },
      sessionId
    ).then(activity => {
      if (activity) {
        // Update user preferences
        UserPreference.updatePreferences(userId, {
          activityType: 'time_spent',
          contentType,
          contentId,
          metadata: {
            timeSpent: parseInt(timeSpent)
          }
        }).catch(err => {
          console.error('Error updating user preferences:', err);
        });
      }
    }).catch(err => {
      console.error('Error logging time spent activity:', err);
    });
    
    // Continue with the request
    next();
  } catch (error) {
    console.error('Error in trackTimeSpent middleware:', error);
    // Don't block the request if tracking fails
    next();
  }
};

// Helper function to generate a session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Helper function to determine device type from user agent
function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (/mobile/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet/i.test(userAgent)) {
    return 'tablet';
  } else if (/ipad/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}
