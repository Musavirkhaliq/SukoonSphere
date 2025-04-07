import { StatusCodes } from "http-status-codes";
import UserActivity from "../models/analytics/userActivityModel.js";
import UserPreference from "../models/analytics/userPreferenceModel.js";
import Recommendation from "../models/analytics/recommendationModel.js";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";

// Track user activity
export const trackActivity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { 
      activityType, 
      contentType, 
      contentId, 
      contentModel,
      metadata = {},
      sessionId
    } = req.body;

    // Validate required fields
    if (!activityType || !contentType || !contentId || !contentModel) {
      throw new BadRequestError("Missing required fields");
    }

    // Log the activity
    const activity = await UserActivity.logActivity(
      userId,
      activityType,
      contentType,
      contentId,
      contentModel,
      metadata,
      sessionId
    );

    // Update user preferences based on this activity
    if (activity) {
      // Get creator ID based on content type and model
      let creatorId = null;
      
      try {
        const Model = mongoose.model(contentModel);
        const content = await Model.findById(contentId);
        
        if (content) {
          // Different models use different field names for the creator
          if (content.createdBy) creatorId = content.createdBy;
          else if (content.author) creatorId = content.author;
          else if (content.userId) creatorId = content.userId;
        }
      } catch (error) {
        console.error("Error getting content creator:", error);
      }

      // Update user preferences
      await UserPreference.updatePreferences(userId, {
        activityType,
        contentType,
        contentId,
        metadata,
        creatorId
      });
    }

    res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Activity tracked successfully" 
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error tracking activity" 
    });
  }
};

// Get user activity history
export const getUserActivityHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 20, activityType, contentType } = req.query;
    
    // Build query
    const query = { userId };
    if (activityType) query.activityType = activityType;
    if (contentType) query.contentType = contentType;
    
    // Get activities
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate({
        path: "contentId",
        select: "title description content imageUrl coverImage videoUrl audioUrl createdBy author username userAvatar createdAt"
      });
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      activities 
    });
  } catch (error) {
    console.error("Error getting user activity history:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error getting user activity history" 
    });
  }
};

// Get user preferences
export const getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get user preferences
    const preferences = await UserPreference.getTopPreferences(userId);
    
    if (!preferences) {
      return res.status(StatusCodes.OK).json({ 
        success: true,
        message: "No preferences found",
        preferences: null
      });
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      preferences 
    });
  } catch (error) {
    console.error("Error getting user preferences:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error getting user preferences" 
    });
  }
};

// Get recommendations for user
export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.user;
    const { contentType, limit = 10 } = req.query;
    
    // Get recommendations
    const recommendations = await Recommendation.getUserRecommendations(
      userId,
      contentType,
      parseInt(limit)
    );
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      recommendations 
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error getting recommendations" 
    });
  }
};

// Mark recommendation as clicked
export const markRecommendationClicked = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recommendationId } = req.params;
    
    if (!recommendationId) {
      throw new BadRequestError("Recommendation ID is required");
    }
    
    // Mark as clicked
    const success = await Recommendation.markRecommendationClicked(
      userId,
      recommendationId
    );
    
    if (!success) {
      throw new NotFoundError("Recommendation not found");
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Recommendation marked as clicked" 
    });
  } catch (error) {
    console.error("Error marking recommendation as clicked:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error marking recommendation as clicked" 
    });
  }
};

// Generate new recommendations for user
export const generateRecommendations = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Generate recommendations
    const success = await Recommendation.generateRecommendations(userId);
    
    if (!success) {
      throw new Error("Failed to generate recommendations");
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Recommendations generated successfully" 
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error generating recommendations" 
    });
  }
};

// Get popular content
export const getPopularContent = async (req, res) => {
  try {
    const { contentType, timeframe = 7, limit = 10 } = req.query;
    
    if (!contentType) {
      throw new BadRequestError("Content type is required");
    }
    
    // Get popular content
    const popularContent = await UserActivity.getPopularContent(
      "view",
      contentType,
      parseInt(timeframe),
      parseInt(limit)
    );
    
    // Get content details
    const contentIds = popularContent.map(item => item._id);
    
    let Model;
    switch (contentType) {
      case 'post':
        Model = mongoose.model("Post");
        break;
      case 'article':
        Model = mongoose.model("ArticleModel");
        break;
      case 'video':
        Model = mongoose.model("Video");
        break;
      case 'podcast':
        Model = mongoose.model("Podcast");
        break;
      case 'question':
        Model = mongoose.model("Question");
        break;
      case 'answer':
        Model = mongoose.model("Answer");
        break;
      default:
        throw new BadRequestError("Invalid content type");
    }
    
    const contentDetails = await Model.find({ _id: { $in: contentIds } });
    
    // Merge content details with popularity data
    const result = popularContent.map(item => {
      const details = contentDetails.find(
        content => content._id.toString() === item._id.toString()
      );
      return {
        ...item,
        details
      };
    });
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      popularContent: result 
    });
  } catch (error) {
    console.error("Error getting popular content:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message || "Error getting popular content" 
    });
  }
};
