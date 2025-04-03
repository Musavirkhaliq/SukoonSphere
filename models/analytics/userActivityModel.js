import mongoose from "mongoose";

const UserActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    activityType: {
      type: String,
      enum: [
        "view", // Viewing content
        "like", // Liking content
        "comment", // Commenting on content
        "share", // Sharing content
        "search", // Search queries
        "click", // Clicking on content
        "complete", // Completing content (e.g., watching a video to the end)
        "bookmark", // Bookmarking content
        "follow", // Following a user
        "time_spent" // Time spent on content
      ],
      required: true,
      index: true
    },
    contentType: {
      type: String,
      enum: [
        "post",
        "article",
        "video",
        "podcast",
        "question",
        "answer",
        "profile",
        "category",
        "tag"
      ],
      required: true,
      index: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "contentModel",
      index: true
    },
    contentModel: {
      type: String,
      required: true,
      enum: [
        "Post",
        "ArticleModel",
        "Video",
        "Podcast",
        "Question",
        "Answer",
        "User"
      ]
    },
    metadata: {
      // Additional data specific to the activity
      tags: [String],
      category: String,
      searchQuery: String,
      timeSpent: Number, // in seconds
      completionPercentage: Number, // for videos/podcasts
      referrer: String, // where the user came from
      device: String, // mobile, desktop, tablet
      location: {
        type: {
          type: String,
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },
    sessionId: {
      type: String,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound indexes for efficient querying
UserActivitySchema.index({ userId: 1, activityType: 1, contentType: 1 });
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ contentId: 1, activityType: 1 });
UserActivitySchema.index({ "metadata.tags": 1 });

// Static method to log user activity
UserActivitySchema.statics.logActivity = async function(
  userId,
  activityType,
  contentType,
  contentId,
  contentModel,
  metadata = {},
  sessionId = null
) {
  try {
    return await this.create({
      userId,
      activityType,
      contentType,
      contentId,
      contentModel,
      metadata,
      sessionId
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
    // Don't throw error to prevent disrupting user experience
    return null;
  }
};

// Method to get user's recent activities
UserActivitySchema.statics.getUserRecentActivities = async function(
  userId,
  limit = 20
) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "contentId",
      select: "title description imageUrl coverImage videoUrl audioUrl content"
    });
};

// Method to get most popular content by activity type
UserActivitySchema.statics.getPopularContent = async function(
  activityType,
  contentType,
  timeframe = 7, // days
  limit = 10
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);

  return this.aggregate([
    {
      $match: {
        activityType,
        contentType,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: "$contentId",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);

export default UserActivity;
