import mongoose from "mongoose";

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    // Content type preferences (normalized scores between 0-1)
    contentTypePreferences: {
      post: { type: Number, default: 0 },
      article: { type: Number, default: 0 },
      video: { type: Number, default: 0 },
      podcast: { type: Number, default: 0 },
      question: { type: Number, default: 0 },
      answer: { type: Number, default: 0 }
    },
    // Tag preferences (key-value pairs of tag and score)
    tagPreferences: {
      type: Map,
      of: Number,
      default: {}
    },
    // Category preferences
    categoryPreferences: {
      type: Map,
      of: Number,
      default: {}
    },
    // Creator preferences (users whose content they engage with)
    creatorPreferences: [
      {
        creatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    // Time-based preferences
    timePreferences: {
      morningActivity: { type: Number, default: 0 }, // 5am-12pm
      afternoonActivity: { type: Number, default: 0 }, // 12pm-5pm
      eveningActivity: { type: Number, default: 0 }, // 5pm-9pm
      nightActivity: { type: Number, default: 0 } // 9pm-5am
    },
    // Engagement metrics
    engagementMetrics: {
      averageTimeSpent: { type: Number, default: 0 }, // in seconds
      engagementRate: { type: Number, default: 0 }, // interactions per content view
      completionRate: { type: Number, default: 0 }, // for videos/podcasts
      returnRate: { type: Number, default: 0 } // how often they return to the platform
    },
    // Last updated timestamp
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Method to update user preferences based on activity
UserPreferenceSchema.statics.updatePreferences = async function(
  userId,
  activityData
) {
  try {
    const {
      activityType,
      contentType,
      contentId,
      metadata = {},
      creatorId
    } = activityData;

    // Get current preferences or create if doesn't exist
    let userPreference = await this.findOne({ userId });
    if (!userPreference) {
      userPreference = await this.create({ userId });
    }

    // Update last updated timestamp
    userPreference.lastUpdated = new Date();

    // Update content type preferences
    if (contentType) {
      const contentTypeKey = contentType.toLowerCase();
      if (userPreference.contentTypePreferences.hasOwnProperty(contentTypeKey)) {
        // Increase preference score based on activity type
        const incrementValue = getActivityWeight(activityType);
        userPreference.contentTypePreferences[contentTypeKey] += incrementValue;
        
        // Normalize if exceeds 1
        if (userPreference.contentTypePreferences[contentTypeKey] > 1) {
          userPreference.contentTypePreferences[contentTypeKey] = 1;
        }
      }
    }

    // Update tag preferences
    if (metadata.tags && metadata.tags.length > 0) {
      metadata.tags.forEach(tag => {
        const currentValue = userPreference.tagPreferences.get(tag) || 0;
        const incrementValue = getActivityWeight(activityType);
        userPreference.tagPreferences.set(tag, Math.min(currentValue + incrementValue, 1));
      });
    }

    // Update category preferences
    if (metadata.category) {
      const currentValue = userPreference.categoryPreferences.get(metadata.category) || 0;
      const incrementValue = getActivityWeight(activityType);
      userPreference.categoryPreferences.set(
        metadata.category,
        Math.min(currentValue + incrementValue, 1)
      );
    }

    // Update creator preferences
    if (creatorId) {
      const creatorIndex = userPreference.creatorPreferences.findIndex(
        pref => pref.creatorId.toString() === creatorId.toString()
      );

      if (creatorIndex >= 0) {
        // Update existing creator preference
        userPreference.creatorPreferences[creatorIndex].score += getActivityWeight(activityType);
        if (userPreference.creatorPreferences[creatorIndex].score > 1) {
          userPreference.creatorPreferences[creatorIndex].score = 1;
        }
      } else {
        // Add new creator preference
        userPreference.creatorPreferences.push({
          creatorId,
          score: getActivityWeight(activityType)
        });
      }
    }

    // Update time preferences
    const hour = new Date().getHours();
    let timeField = "";
    if (hour >= 5 && hour < 12) timeField = "morningActivity";
    else if (hour >= 12 && hour < 17) timeField = "afternoonActivity";
    else if (hour >= 17 && hour < 21) timeField = "eveningActivity";
    else timeField = "nightActivity";

    userPreference.timePreferences[timeField] += 0.1;
    if (userPreference.timePreferences[timeField] > 1) {
      userPreference.timePreferences[timeField] = 1;
    }

    // Update engagement metrics
    if (activityType === "time_spent" && metadata.timeSpent) {
      // Update average time spent
      const currentAvg = userPreference.engagementMetrics.averageTimeSpent;
      const count = await mongoose.model("UserActivity").countDocuments({
        userId,
        activityType: "view"
      });
      
      userPreference.engagementMetrics.averageTimeSpent = 
        (currentAvg * (count - 1) + metadata.timeSpent) / count;
    }

    if (activityType === "complete" && metadata.completionPercentage) {
      // Update completion rate
      const currentRate = userPreference.engagementMetrics.completionRate;
      const count = await mongoose.model("UserActivity").countDocuments({
        userId,
        activityType: "view",
        contentType: { $in: ["video", "podcast"] }
      });
      
      userPreference.engagementMetrics.completionRate = 
        (currentRate * (count - 1) + metadata.completionPercentage) / count;
    }

    // Save updated preferences
    await userPreference.save();
    return userPreference;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return null;
  }
};

// Helper function to get weight for different activity types
function getActivityWeight(activityType) {
  const weights = {
    view: 0.05,
    click: 0.1,
    like: 0.2,
    comment: 0.3,
    share: 0.4,
    bookmark: 0.4,
    complete: 0.5,
    follow: 0.3,
    time_spent: 0.1
  };
  
  return weights[activityType] || 0.1;
}

// Method to get user's top preferences
UserPreferenceSchema.statics.getTopPreferences = async function(userId, limit = 5) {
  const userPreference = await this.findOne({ userId });
  if (!userPreference) return null;

  // Get top content types
  const contentTypes = Object.entries(userPreference.contentTypePreferences)
    .map(([type, score]) => ({ type, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Get top tags
  const tags = Array.from(userPreference.tagPreferences.entries())
    .map(([tag, score]) => ({ tag, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Get top categories
  const categories = Array.from(userPreference.categoryPreferences.entries())
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Get top creators
  const creators = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$creatorPreferences" },
    { $sort: { "creatorPreferences.score": -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "creatorPreferences.creatorId",
        foreignField: "_id",
        as: "creatorDetails"
      }
    },
    {
      $project: {
        _id: 0,
        creatorId: "$creatorPreferences.creatorId",
        score: "$creatorPreferences.score",
        name: { $arrayElemAt: ["$creatorDetails.name", 0] },
        avatar: { $arrayElemAt: ["$creatorDetails.avatar", 0] }
      }
    }
  ]);

  return {
    contentTypes,
    tags,
    categories,
    creators,
    timePreferences: userPreference.timePreferences,
    engagementMetrics: userPreference.engagementMetrics
  };
};

const UserPreference = mongoose.model("UserPreference", UserPreferenceSchema);

export default UserPreference;
