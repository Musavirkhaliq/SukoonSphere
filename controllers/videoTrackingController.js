import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";
import VideoWatchHistory from "../models/videos/videoWatchHistoryModel.js";
import Video from "../models/videos/videoModel.js";
import VideoPlaylist from "../models/videos/videoPlaylistModel.js";
import UserActivity from "../models/analytics/userActivityModel.js";
import UserPreference from "../models/analytics/userPreferenceModel.js";

// Track video progress
export const trackVideoProgress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { videoId, watchPercentage, status } = req.body;

    // Validate required fields
    if (!videoId || watchPercentage === undefined) {
      throw new BadRequestError("Missing required fields");
    }

    // Ensure watchPercentage is a valid number
    const percentage = parseFloat(watchPercentage);
    if (isNaN(percentage)) {
      console.warn(`Invalid watchPercentage value: ${watchPercentage}`);
      // Use 0 as a fallback
      watchPercentage = 0;
    } else {
      // Ensure percentage is between 0 and 100
      watchPercentage = Math.max(0, Math.min(100, percentage));
    }

    try {
      // Validate video exists
      const video = await Video.findById(videoId);
      if (!video) {
        throw new NotFoundError("Video not found");
      }
    } catch (error) {
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        throw new BadRequestError("Invalid video ID format");
      }
      throw error;
    }

    console.log(`Tracking progress for user ${userId}, video ${videoId}: ${watchPercentage}% (${status})`);

    // Update watch history
    const watchHistory = await VideoWatchHistory.updateWatchHistory(
      userId,
      videoId,
      watchPercentage,
      status // Pass the status to the model
    );

    // Log the status based on watch percentage
    if (status === 'in-progress' && watchPercentage < 90) {
      console.log(`Video ${videoId} marked as 'in progress' for user ${userId}`);
    } else if (status === 'completed' || watchPercentage >= 90) {
      console.log(`Video ${videoId} marked as 'completed' for user ${userId}`);
    }

    // Track completion if watched more than 90%
    if (watchPercentage >= 90) {
      await UserActivity.logActivity(
        userId,
        'complete',
        'video',
        videoId,
        'Video',
        { completionPercentage: watchPercentage },
        req.body.sessionId
      );

      // Update user preferences
      await UserPreference.updatePreferences(userId, {
        activityType: 'complete',
        contentType: 'video',
        contentId: videoId,
        metadata: { completionPercentage: watchPercentage }
      });
    }

    // Increment view count if this is a new view or first time reaching 10%
    if (watchPercentage >= 10 && (!watchHistory || watchHistory.watchPercentage < 10)) {
      await Video.findByIdAndUpdate(videoId, { $inc: { viewCount: 1 } });
    }

    // Determine the final status (use the provided status or calculate it)
    const finalStatus = status || (watchPercentage >= 90 ? 'completed' : watchPercentage > 0 ? 'in-progress' : 'not-started');

    res.status(StatusCodes.OK).json({
      success: true,
      watchHistory,
      status: finalStatus
    });
  } catch (error) {
    console.error("Error tracking video progress:", error);
    throw error;
  }
};

// Get user's video watch history
export const getUserVideoHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 20, status = 'all' } = req.query;

    let watchHistory;

    if (status && status !== 'all') {
      // Get videos by specific status
      watchHistory = await VideoWatchHistory.getVideosByStatus(
        userId,
        status,
        parseInt(limit)
      );
    } else {
      // Get all watch history
      watchHistory = await VideoWatchHistory.getUserWatchHistory(
        userId,
        parseInt(limit)
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      watchHistory
    });
  } catch (error) {
    console.error("Error getting user video history:", error);
    throw error;
  }
};

// Get user's in-progress videos
export const getInProgressVideos = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 10 } = req.query;

    const inProgressVideos = await VideoWatchHistory.getInProgressVideos(
      userId,
      parseInt(limit)
    );

    res.status(StatusCodes.OK).json({
      success: true,
      inProgressVideos
    });
  } catch (error) {
    console.error("Error getting in-progress videos:", error);
    throw error;
  }
};

// Get video recommendations
export const getVideoRecommendations = async (req, res) => {
  try {
    const { userId } = req.user;
    const { videoId, limit = 10 } = req.query;

    // Validate video exists
    const currentVideo = await Video.findById(videoId);
    if (!currentVideo) {
      throw new NotFoundError("Video not found");
    }

    // Get videos from the same playlist if applicable
    let playlistVideos = [];

    // First check if video is in a new-style playlist
    const playlists = await VideoPlaylist.find({ videos: videoId });

    if (playlists.length > 0) {
      // Use the first playlist that contains this video
      const playlist = playlists[0];

      // Get all videos from this playlist except the current one
      const playlistVideoIds = playlist.videos.filter(id => id.toString() !== videoId);

      if (playlistVideoIds.length > 0) {
        playlistVideos = await Video.find({
          _id: { $in: playlistVideoIds }
        })
        .sort({ createdAt: 1 })
        .limit(parseInt(limit));
      }
    }
    // Fall back to old-style playlist if no new-style playlist found
    else if (currentVideo.playlistId) {
      playlistVideos = await Video.find({
        playlistId: currentVideo.playlistId,
        _id: { $ne: videoId }
      })
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));
    }

    // Get videos with similar tags or category
    let similarVideos = [];
    if (currentVideo.tags && currentVideo.tags.length > 0 || currentVideo.category) {
      const query = {
        _id: { $ne: videoId },
        $or: []
      };

      if (currentVideo.tags && currentVideo.tags.length > 0) {
        query.$or.push({ tags: { $in: currentVideo.tags } });
      }

      if (currentVideo.category) {
        query.$or.push({ category: currentVideo.category });
      }

      similarVideos = await Video.find(query)
        .sort({ viewCount: -1, createdAt: -1 })
        .limit(parseInt(limit) - playlistVideos.length);
    }

    // Get popular videos if we still need more recommendations
    let popularVideos = [];
    if (playlistVideos.length + similarVideos.length < parseInt(limit)) {
      popularVideos = await Video.find({
        _id: {
          $ne: videoId,
          $nin: [...playlistVideos.map(v => v._id), ...similarVideos.map(v => v._id)]
        }
      })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(parseInt(limit) - playlistVideos.length - similarVideos.length);
    }

    // Combine all recommendations
    const recommendations = [
      ...playlistVideos.map(video => ({
        ...video.toObject(),
        recommendationType: 'playlist'
      })),
      ...similarVideos.map(video => ({
        ...video.toObject(),
        recommendationType: 'similar'
      })),
      ...popularVideos.map(video => ({
        ...video.toObject(),
        recommendationType: 'popular'
      }))
    ];

    res.status(StatusCodes.OK).json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error("Error getting video recommendations:", error);
    throw error;
  }
};
