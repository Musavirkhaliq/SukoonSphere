import mongoose from "mongoose";

const videoAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Achievement types
    videosWatched: {
      count: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    playlistsCompleted: {
      count: { type: Number, default: 0 },
      playlists: [
        {
          playlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VideoPlaylist",
          },
          completedAt: { type: Date, default: Date.now },
        },
      ],
      lastUpdated: { type: Date, default: Date.now },
    },
    watchStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastWatchDate: { type: Date, default: null },
    },
    badges: [
      {
        type: {
          type: String,
          enum: [
            "first_video",
            "video_watcher_5",
            "video_watcher_10",
            "video_watcher_25",
            "video_watcher_50",
            "video_watcher_100",
            "first_playlist",
            "playlist_master_5",
            "playlist_master_10",
            "streak_3",
            "streak_7",
            "streak_14",
            "streak_30"
          ]
        },
        earnedAt: { type: Date, default: Date.now },
        seen: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a compound index for efficient querying
videoAchievementSchema.index({ user: 1 }, { unique: true });

// Static method to update video watched count
videoAchievementSchema.statics.updateVideoWatched = async function(userId, videoId) {
  try {
    // Check if this video was already completed by this user
    const watchHistory = await mongoose.model('VideoWatchHistory').findOne({
      userId,
      videoId,
      completedWatching: true
    });

    // If this is a rewatch (video was already completed before), don't increment count
    const isRewatch = watchHistory && watchHistory.firstCompletedAt &&
                     watchHistory.firstCompletedAt.getTime() < new Date().getTime() - 60000; // 1 minute ago

    console.log(`Video ${videoId} completion for user ${userId}: ${isRewatch ? 'rewatch' : 'first completion'}`);

    // Find or create user achievements
    const userAchievement = await this.findOneAndUpdate(
      { user: userId },
      {
        // Only increment count if this is not a rewatch
        ...(!isRewatch ? { $inc: { "videosWatched.count": 1 } } : {}),
        $set: { "videosWatched.lastUpdated": new Date() }
      },
      { upsert: true, new: true }
    );

    // Check for badges
    const badgesToAdd = [];
    const videosWatched = userAchievement.videosWatched.count;

    // First video badge
    if (videosWatched === 1 && !hasBadge(userAchievement, "first_video")) {
      badgesToAdd.push({ type: "first_video", earnedAt: new Date() });
    }

    // Video watcher badges
    if (videosWatched >= 5 && !hasBadge(userAchievement, "video_watcher_5")) {
      badgesToAdd.push({ type: "video_watcher_5", earnedAt: new Date() });
    }

    if (videosWatched >= 10 && !hasBadge(userAchievement, "video_watcher_10")) {
      badgesToAdd.push({ type: "video_watcher_10", earnedAt: new Date() });
    }

    if (videosWatched >= 25 && !hasBadge(userAchievement, "video_watcher_25")) {
      badgesToAdd.push({ type: "video_watcher_25", earnedAt: new Date() });
    }

    if (videosWatched >= 50 && !hasBadge(userAchievement, "video_watcher_50")) {
      badgesToAdd.push({ type: "video_watcher_50", earnedAt: new Date() });
    }

    if (videosWatched >= 100 && !hasBadge(userAchievement, "video_watcher_100")) {
      badgesToAdd.push({ type: "video_watcher_100", earnedAt: new Date() });
    }

    // Update watch streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWatchDate = userAchievement.watchStreak.lastWatchDate;
    let streakUpdated = false;

    if (lastWatchDate) {
      const lastDate = new Date(lastWatchDate);
      lastDate.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // If last watch was yesterday, increment streak
      if (lastDate.getTime() === yesterday.getTime()) {
        await this.findOneAndUpdate(
          { user: userId },
          {
            $inc: { "watchStreak.current": 1 },
            $set: { "watchStreak.lastWatchDate": today }
          }
        );
        streakUpdated = true;
      }
      // If last watch was today, don't change streak
      else if (lastDate.getTime() === today.getTime()) {
        streakUpdated = true;
      }
      // If streak is broken, reset to 1
      else {
        await this.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              "watchStreak.current": 1,
              "watchStreak.lastWatchDate": today
            }
          }
        );
        streakUpdated = true;
      }
    } else {
      // First time watching, set streak to 1
      await this.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            "watchStreak.current": 1,
            "watchStreak.lastWatchDate": today
          }
        }
      );
      streakUpdated = true;
    }

    // Update longest streak if needed
    if (streakUpdated) {
      const updatedAchievement = await this.findOne({ user: userId });
      if (updatedAchievement.watchStreak.current > updatedAchievement.watchStreak.longest) {
        await this.findOneAndUpdate(
          { user: userId },
          {
            $set: { "watchStreak.longest": updatedAchievement.watchStreak.current }
          }
        );

        // Check for streak badges
        const currentStreak = updatedAchievement.watchStreak.current;

        if (currentStreak >= 3 && !hasBadge(updatedAchievement, "streak_3")) {
          badgesToAdd.push({ type: "streak_3", earnedAt: new Date() });
        }

        if (currentStreak >= 7 && !hasBadge(updatedAchievement, "streak_7")) {
          badgesToAdd.push({ type: "streak_7", earnedAt: new Date() });
        }

        if (currentStreak >= 14 && !hasBadge(updatedAchievement, "streak_14")) {
          badgesToAdd.push({ type: "streak_14", earnedAt: new Date() });
        }

        if (currentStreak >= 30 && !hasBadge(updatedAchievement, "streak_30")) {
          badgesToAdd.push({ type: "streak_30", earnedAt: new Date() });
        }
      }
    }

    // Add new badges if any
    if (badgesToAdd.length > 0) {
      await this.findOneAndUpdate(
        { user: userId },
        { $push: { badges: { $each: badgesToAdd } } }
      );

      // Return the newly earned badges
      return badgesToAdd;
    }

    return [];
  } catch (error) {
    console.error("Error updating video achievements:", error);
    return [];
  }
};

// Static method to update playlist completion
videoAchievementSchema.statics.updatePlaylistCompleted = async function(userId, playlistId) {
  try {
    // Check if this playlist was already completed
    const existingAchievement = await this.findOne({
      user: userId,
      "playlistsCompleted.playlists.playlistId": playlistId
    });

    if (existingAchievement) {
      console.log(`Playlist ${playlistId} already completed by user ${userId} - not counting again`);
      return []; // Already completed this playlist
    }

    console.log(`First completion of playlist ${playlistId} by user ${userId}`);

    // Update the achievement - only for first completion
    const userAchievement = await this.findOneAndUpdate(
      { user: userId },
      {
        $inc: { "playlistsCompleted.count": 1 },
        $push: {
          "playlistsCompleted.playlists": {
            playlistId,
            completedAt: new Date()
          }
        },
        $set: { "playlistsCompleted.lastUpdated": new Date() }
      },
      { upsert: true, new: true }
    );

    // Check for badges
    const badgesToAdd = [];
    const playlistsCompleted = userAchievement.playlistsCompleted.count;

    // First playlist badge
    if (playlistsCompleted === 1 && !hasBadge(userAchievement, "first_playlist")) {
      badgesToAdd.push({ type: "first_playlist", earnedAt: new Date() });
    }

    // Playlist master badges
    if (playlistsCompleted >= 5 && !hasBadge(userAchievement, "playlist_master_5")) {
      badgesToAdd.push({ type: "playlist_master_5", earnedAt: new Date() });
    }

    if (playlistsCompleted >= 10 && !hasBadge(userAchievement, "playlist_master_10")) {
      badgesToAdd.push({ type: "playlist_master_10", earnedAt: new Date() });
    }

    // Add new badges if any
    if (badgesToAdd.length > 0) {
      await this.findOneAndUpdate(
        { user: userId },
        { $push: { badges: { $each: badgesToAdd } } }
      );

      // Return the newly earned badges
      return badgesToAdd;
    }

    return [];
  } catch (error) {
    console.error("Error updating playlist achievements:", error);
    return [];
  }
};

// Static method to get user's video achievements
videoAchievementSchema.statics.getUserAchievements = async function(userId) {
  try {
    const achievements = await this.findOne({ user: userId });
    return achievements || {
      videosWatched: { count: 0 },
      playlistsCompleted: { count: 0, playlists: [] },
      watchStreak: { current: 0, longest: 0 },
      badges: []
    };
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return {
      videosWatched: { count: 0 },
      playlistsCompleted: { count: 0, playlists: [] },
      watchStreak: { current: 0, longest: 0 },
      badges: []
    };
  }
};

// Static method to mark badges as seen
videoAchievementSchema.statics.markBadgesAsSeen = async function(userId) {
  try {
    await this.findOneAndUpdate(
      { user: userId },
      { $set: { "badges.$[].seen": true } }
    );
    return true;
  } catch (error) {
    console.error("Error marking badges as seen:", error);
    return false;
  }
};

// Helper function to check if user has a badge
function hasBadge(userAchievement, badgeType) {
  return userAchievement.badges.some(badge => badge.type === badgeType);
}

export default mongoose.model("VideoAchievement", videoAchievementSchema);
