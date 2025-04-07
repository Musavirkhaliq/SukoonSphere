import mongoose from "mongoose";

const videoWatchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true
    },
    watchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedWatching: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now
    },
    firstCompletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient querying
videoWatchHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });

// Static method to update watch history
videoWatchHistorySchema.statics.updateWatchHistory = async function(
  userId,
  videoId,
  watchPercentage,
  status = null // Optional status parameter
) {
  try {
    // Ensure watchPercentage is a valid number
    const percentage = parseFloat(watchPercentage);
    if (isNaN(percentage)) {
      console.warn(`Invalid watchPercentage value: ${watchPercentage}`);
      watchPercentage = 0;
    } else {
      // Ensure percentage is between 0 and 100
      watchPercentage = Math.max(0, Math.min(100, percentage));
    }

    const completedWatching = watchPercentage >= 90; // Consider video completed if watched 90% or more
    const inProgress = watchPercentage > 0 && watchPercentage < 90; // In progress if between 0% and 90%

    // Check if this is a first-time completion
    const existingRecord = await this.findOne({ userId, videoId });
    const isFirstTimeCompletion = completedWatching &&
                               (!existingRecord || !existingRecord.completedWatching);

    // Check if this is the first time marking as in progress
    const isFirstTimeInProgress = inProgress && !existingRecord;

    if (isFirstTimeCompletion) {
      console.log(`First-time completion of video ${videoId} by user ${userId}`);
    } else if (completedWatching && existingRecord && existingRecord.completedWatching) {
      console.log(`Rewatch completion of video ${videoId} by user ${userId}`);
    } else if (isFirstTimeInProgress) {
      console.log(`First-time in-progress for video ${videoId} by user ${userId}`);
    }

    try {
      // Validate inputs
      if (!userId || !videoId) {
        console.error('Missing required fields for watch history update:', { userId, videoId });
        return null;
      }

      // Find and update or create if not exists
      const result = await this.findOneAndUpdate(
        { userId, videoId },
        {
          watchPercentage,
          completedWatching,
          lastWatchedAt: new Date(),
          // If this is first time completion, mark the time
          ...(isFirstTimeCompletion ? { firstCompletedAt: new Date() } : {}),
          // Add status field (use provided status or calculate it)
          status: status || (completedWatching ? 'completed' : watchPercentage > 0 ? 'in-progress' : 'not-started')
        },
        { upsert: true, new: true }
      );

      return result;
    } catch (updateError) {
      console.error('Error in findOneAndUpdate for watch history:', updateError);
      // Handle CastError (invalid ObjectId)
      if (updateError.name === 'CastError') {
        console.error('Invalid ID format in watch history update:', { userId, videoId });
      }
      return null;
    }

  } catch (error) {
    console.error("Error updating video watch history:", error);
    return null;
  }
};

// Static method to get user's watch history
videoWatchHistorySchema.statics.getUserWatchHistory = async function(
  userId,
  limit = 20
) {
  return this.find({ userId })
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .populate({
      path: "videoId",
      select: "title description coverImage videoUrl type"
    });
};

// Static method to get user's in-progress videos
videoWatchHistorySchema.statics.getInProgressVideos = async function(
  userId,
  limit = 10
) {
  return this.find({
    userId,
    completedWatching: false,
    watchPercentage: { $gt: 0, $lt: 90 }
  })
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .populate({
      path: "videoId",
      select: "title description coverImage videoUrl type"
    });
};

// Static method to get videos by status
videoWatchHistorySchema.statics.getVideosByStatus = async function(
  userId,
  status,
  limit = 20
) {
  let query = { userId };

  switch (status) {
    case 'completed':
      query.completedWatching = true;
      break;
    case 'in-progress':
      query.completedWatching = false;
      query.watchPercentage = { $gt: 0, $lt: 90 };
      break;
    case 'not-started':
      query.watchPercentage = 0;
      break;
    default:
      // No additional filters for 'all'
      break;
  }

  return this.find(query)
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .populate({
      path: "videoId",
      select: "title description coverImage videoUrl type"
    });
};

const VideoWatchHistory = mongoose.model("VideoWatchHistory", videoWatchHistorySchema);

export default VideoWatchHistory;
