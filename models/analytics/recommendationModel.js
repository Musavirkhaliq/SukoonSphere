import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    recommendations: [
      {
        contentId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "contentModel",
          required: true
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
            "Answer"
          ]
        },
        contentType: {
          type: String,
          required: true,
          enum: [
            "post",
            "article",
            "video",
            "podcast",
            "question",
            "answer"
          ]
        },
        score: {
          type: Number,
          required: true
        },
        reason: {
          type: String,
          enum: [
            "content_similarity",
            "user_preference",
            "popular_content",
            "creator_affinity",
            "tag_based",
            "category_based",
            "collaborative_filtering"
          ]
        },
        isShown: {
          type: Boolean,
          default: false
        },
        isClicked: {
          type: Boolean,
          default: false
        },
        shownAt: Date,
        clickedAt: Date
      }
    ],
    generatedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setDate(date.getDate() + 1); // Recommendations expire after 1 day
        return date;
      }
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
RecommendationSchema.index({ userId: 1, generatedAt: -1 });
RecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to get user's recommendations
RecommendationSchema.statics.getUserRecommendations = async function(
  userId,
  contentType = null,
  limit = 10
) {
  try {
    // Find the most recent recommendation set for this user
    let query = { userId };
    
    // Check if recommendations have expired
    const latestRecs = await this.findOne(query)
      .sort({ generatedAt: -1 })
      .limit(1);
    
    if (!latestRecs || latestRecs.generatedAt < new Date(Date.now() - 12 * 60 * 60 * 1000)) {
      // If no recommendations or older than 12 hours, generate new ones
      await this.generateRecommendations(userId);
    }
    
    // Get the latest recommendations
    const recommendations = await this.findOne({ userId })
      .sort({ generatedAt: -1 })
      .limit(1);
    
    if (!recommendations) return [];
    
    // Filter by content type if specified
    let filteredRecs = recommendations.recommendations;
    if (contentType) {
      filteredRecs = filteredRecs.filter(rec => rec.contentType === contentType);
    }
    
    // Sort by score and limit
    filteredRecs = filteredRecs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Mark these recommendations as shown
    const recIds = filteredRecs.map(rec => rec._id);
    await this.updateMany(
      { userId, "recommendations._id": { $in: recIds } },
      { 
        $set: { 
          "recommendations.$[elem].isShown": true,
          "recommendations.$[elem].shownAt": new Date()
        } 
      },
      { 
        arrayFilters: [{ "elem._id": { $in: recIds } }] 
      }
    );
    
    // Populate content details
    const populatedRecs = await this.populate(filteredRecs, {
      path: "contentId",
      select: "title description content imageUrl coverImage videoUrl audioUrl createdBy author username userAvatar createdAt"
    });
    
    return populatedRecs;
  } catch (error) {
    console.error("Error getting user recommendations:", error);
    return [];
  }
};

// Method to mark a recommendation as clicked
RecommendationSchema.statics.markRecommendationClicked = async function(
  userId,
  recommendationId
) {
  try {
    await this.updateOne(
      { userId, "recommendations._id": recommendationId },
      { 
        $set: { 
          "recommendations.$.isClicked": true,
          "recommendations.$.clickedAt": new Date()
        } 
      }
    );
    return true;
  } catch (error) {
    console.error("Error marking recommendation as clicked:", error);
    return false;
  }
};

// Method to generate recommendations for a user
RecommendationSchema.statics.generateRecommendations = async function(userId) {
  try {
    // Import required models
    const UserPreference = mongoose.model("UserPreference");
    const UserActivity = mongoose.model("UserActivity");
    const User = mongoose.model("User");
    
    // Get user preferences
    let userPreference = await UserPreference.findOne({ userId });
    if (!userPreference) {
      // Create default preferences if none exist
      userPreference = await UserPreference.create({ userId });
    }
    
    // Initialize recommendations array
    const recommendations = [];
    
    // 1. Content-based recommendations based on user preferences
    await generateContentBasedRecommendations(userId, userPreference, recommendations);
    
    // 2. Add popular content recommendations
    await generatePopularContentRecommendations(userId, recommendations);
    
    // 3. Add creator-based recommendations
    await generateCreatorBasedRecommendations(userId, userPreference, recommendations);
    
    // 4. Add tag-based recommendations
    await generateTagBasedRecommendations(userId, userPreference, recommendations);
    
    // Create or update recommendation document
    await this.findOneAndUpdate(
      { userId },
      { 
        userId,
        recommendations,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      { upsert: true, new: true }
    );
    
    return true;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return false;
  }
};

// Helper function to generate content-based recommendations
async function generateContentBasedRecommendations(userId, userPreference, recommendations) {
  try {
    // Get user's top content types
    const contentTypes = Object.entries(userPreference.contentTypePreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // For each preferred content type, find relevant content
    for (const contentType of contentTypes) {
      let model;
      let contentModel;
      
      // Map content type to model
      switch (contentType) {
        case 'post':
          model = mongoose.model("Post");
          contentModel = "Post";
          break;
        case 'article':
          model = mongoose.model("ArticleModel");
          contentModel = "ArticleModel";
          break;
        case 'video':
          model = mongoose.model("Video");
          contentModel = "Video";
          break;
        case 'podcast':
          model = mongoose.model("Podcast");
          contentModel = "Podcast";
          break;
        case 'question':
          model = mongoose.model("Question");
          contentModel = "Question";
          break;
        case 'answer':
          model = mongoose.model("Answer");
          contentModel = "Answer";
          break;
        default:
          continue;
      }
      
      // Get content the user hasn't interacted with
      const userActivity = mongoose.model("UserActivity");
      const interactedContentIds = await userActivity.distinct("contentId", { 
        userId, 
        contentType 
      });
      
      // Find content not interacted with, limit to 5 per content type
      const content = await model.find({
        _id: { $nin: interactedContentIds },
        deleted: { $ne: true }
      })
      .sort({ createdAt: -1 })
      .limit(5);
      
      // Add to recommendations with preference score
      content.forEach(item => {
        recommendations.push({
          contentId: item._id,
          contentModel,
          contentType,
          score: userPreference.contentTypePreferences[contentType] * 0.8,
          reason: "user_preference"
        });
      });
    }
  } catch (error) {
    console.error("Error generating content-based recommendations:", error);
  }
}

// Helper function to generate popular content recommendations
async function generatePopularContentRecommendations(userId, recommendations) {
  try {
    const userActivity = mongoose.model("UserActivity");
    
    // Get popular content from the last 7 days
    const popularContent = await userActivity.getPopularContent("view", "post", 7, 5);
    const popularArticles = await userActivity.getPopularContent("view", "article", 7, 5);
    const popularVideos = await userActivity.getPopularContent("view", "video", 7, 5);
    
    // Map content types to models
    const contentTypeToModel = {
      post: "Post",
      article: "ArticleModel",
      video: "Video",
      podcast: "Podcast",
      question: "Question",
      answer: "Answer"
    };
    
    // Add popular posts
    popularContent.forEach(item => {
      // Check if already in recommendations
      const exists = recommendations.some(rec => 
        rec.contentId.toString() === item._id.toString() && 
        rec.contentType === "post"
      );
      
      if (!exists) {
        recommendations.push({
          contentId: item._id,
          contentModel: "Post",
          contentType: "post",
          score: 0.7 * (item.count / 10), // Normalize by dividing by expected max views
          reason: "popular_content"
        });
      }
    });
    
    // Add popular articles
    popularArticles.forEach(item => {
      const exists = recommendations.some(rec => 
        rec.contentId.toString() === item._id.toString() && 
        rec.contentType === "article"
      );
      
      if (!exists) {
        recommendations.push({
          contentId: item._id,
          contentModel: "ArticleModel",
          contentType: "article",
          score: 0.7 * (item.count / 10),
          reason: "popular_content"
        });
      }
    });
    
    // Add popular videos
    popularVideos.forEach(item => {
      const exists = recommendations.some(rec => 
        rec.contentId.toString() === item._id.toString() && 
        rec.contentType === "video"
      );
      
      if (!exists) {
        recommendations.push({
          contentId: item._id,
          contentModel: "Video",
          contentType: "video",
          score: 0.7 * (item.count / 10),
          reason: "popular_content"
        });
      }
    });
  } catch (error) {
    console.error("Error generating popular content recommendations:", error);
  }
}

// Helper function to generate creator-based recommendations
async function generateCreatorBasedRecommendations(userId, userPreference, recommendations) {
  try {
    // Get top creators the user engages with
    const topCreators = userPreference.creatorPreferences
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(pref => pref.creatorId);
    
    if (topCreators.length === 0) return;
    
    // For each creator, find their recent content
    for (const creatorId of topCreators) {
      // Get creator's score
      const creatorPref = userPreference.creatorPreferences.find(
        pref => pref.creatorId.toString() === creatorId.toString()
      );
      const creatorScore = creatorPref ? creatorPref.score : 0.5;
      
      // Get posts by this creator
      const posts = await mongoose.model("Post").find({
        createdBy: creatorId,
        deleted: { $ne: true }
      })
      .sort({ createdAt: -1 })
      .limit(2);
      
      // Get articles by this creator
      const articles = await mongoose.model("ArticleModel").find({
        author: creatorId,
        deleted: { $ne: true }
      })
      .sort({ createdAt: -1 })
      .limit(2);
      
      // Get videos by this creator
      const videos = await mongoose.model("Video").find({
        author: creatorId
      })
      .sort({ createdAt: -1 })
      .limit(2);
      
      // Add posts to recommendations
      posts.forEach(post => {
        // Check if already in recommendations
        const exists = recommendations.some(rec => 
          rec.contentId.toString() === post._id.toString() && 
          rec.contentType === "post"
        );
        
        if (!exists) {
          recommendations.push({
            contentId: post._id,
            contentModel: "Post",
            contentType: "post",
            score: 0.8 * creatorScore,
            reason: "creator_affinity"
          });
        }
      });
      
      // Add articles to recommendations
      articles.forEach(article => {
        const exists = recommendations.some(rec => 
          rec.contentId.toString() === article._id.toString() && 
          rec.contentType === "article"
        );
        
        if (!exists) {
          recommendations.push({
            contentId: article._id,
            contentModel: "ArticleModel",
            contentType: "article",
            score: 0.8 * creatorScore,
            reason: "creator_affinity"
          });
        }
      });
      
      // Add videos to recommendations
      videos.forEach(video => {
        const exists = recommendations.some(rec => 
          rec.contentId.toString() === video._id.toString() && 
          rec.contentType === "video"
        );
        
        if (!exists) {
          recommendations.push({
            contentId: video._id,
            contentModel: "Video",
            contentType: "video",
            score: 0.8 * creatorScore,
            reason: "creator_affinity"
          });
        }
      });
    }
  } catch (error) {
    console.error("Error generating creator-based recommendations:", error);
  }
}

// Helper function to generate tag-based recommendations
async function generateTagBasedRecommendations(userId, userPreference, recommendations) {
  try {
    // Get top tags the user engages with
    const topTags = Array.from(userPreference.tagPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    if (topTags.length === 0) return;
    
    // Find content with these tags
    const posts = await mongoose.model("Post").find({
      tags: { $in: topTags },
      deleted: { $ne: true }
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    // Add to recommendations
    posts.forEach(post => {
      // Calculate score based on tag match
      let tagScore = 0;
      post.tags.forEach(tag => {
        if (topTags.includes(tag)) {
          tagScore += userPreference.tagPreferences.get(tag) || 0;
        }
      });
      
      // Normalize score
      tagScore = tagScore / post.tags.length;
      
      // Check if already in recommendations
      const exists = recommendations.some(rec => 
        rec.contentId.toString() === post._id.toString() && 
        rec.contentType === "post"
      );
      
      if (!exists) {
        recommendations.push({
          contentId: post._id,
          contentModel: "Post",
          contentType: "post",
          score: 0.7 * tagScore,
          reason: "tag_based"
        });
      }
    });
  } catch (error) {
    console.error("Error generating tag-based recommendations:", error);
  }
}

const Recommendation = mongoose.model("Recommendation", RecommendationSchema);

export default Recommendation;
