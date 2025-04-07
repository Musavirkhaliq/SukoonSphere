import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";
import VideoAchievement from "../models/gamification/videoAchievementModel.js";
import VideoWatchHistory from "../models/videos/videoWatchHistoryModel.js";
import VideoPlaylist from "../models/videos/videoPlaylistModel.js";
import User from "../models/userModel.js";

// Get user's video achievements
export const getUserAchievements = async (req, res) => {
  const { userId } = req.user;

  const achievements = await VideoAchievement.getUserAchievements(userId);

  res.status(StatusCodes.OK).json({ achievements });
};

// Get user's unseen badges
export const getUnseenBadges = async (req, res) => {
  const { userId } = req.user;

  const achievements = await VideoAchievement.findOne({ user: userId });

  if (!achievements) {
    return res.status(StatusCodes.OK).json({ badges: [] });
  }

  const unseenBadges = achievements.badges.filter(badge => !badge.seen);

  res.status(StatusCodes.OK).json({ badges: unseenBadges });
};

// Mark badges as seen
export const markBadgesAsSeen = async (req, res) => {
  const { userId } = req.user;

  await VideoAchievement.markBadgesAsSeen(userId);

  res.status(StatusCodes.OK).json({ message: "Badges marked as seen" });
};

// Check if a playlist is completed
export const checkPlaylistCompletion = async (req, res) => {
  const { userId } = req.user;
  const { playlistId } = req.params;

  // Get the playlist
  const playlist = await VideoPlaylist.findById(playlistId);
  if (!playlist) {
    throw new NotFoundError("Playlist not found");
  }

  // Get user's watch history
  const watchHistory = await VideoWatchHistory.find({
    userId,
    videoId: { $in: playlist.videos }
  });

  // Check if all videos are completed (watched >= 90%)
  const completedVideos = watchHistory.filter(history => history.completedWatching);
  const isCompleted = completedVideos.length === playlist.videos.length;

  // If playlist is completed, update achievements
  let newBadges = [];
  if (isCompleted) {
    // Check if this is a new completion
    const existingAchievement = await VideoAchievement.findOne({
      user: userId,
      "playlistsCompleted.playlists.playlistId": playlistId
    });

    if (!existingAchievement) {
      // Award points to user
      await User.findByIdAndUpdate(userId, {
        $inc: {
          currentPoints: 50,
          totalPoints: 50
        }
      });

      // Update achievements and get new badges
      newBadges = await VideoAchievement.updatePlaylistCompleted(userId, playlistId);
    }
  }

  res.status(StatusCodes.OK).json({
    isCompleted,
    completedVideos: completedVideos.length,
    totalVideos: playlist.videos.length,
    newBadges
  });
};

// Update video watched achievement
export const updateVideoWatched = async (req, res) => {
  const { userId } = req.user;
  const { videoId } = req.body;

  if (!videoId) {
    throw new BadRequestError("Video ID is required");
  }

  // Award points to user
  await User.findByIdAndUpdate(userId, {
    $inc: {
      currentPoints: 10,
      totalPoints: 10
    }
  });

  // Update achievements and get new badges
  const newBadges = await VideoAchievement.updateVideoWatched(userId, videoId);

  res.status(StatusCodes.OK).json({
    message: "Video watched achievement updated",
    newBadges
  });
};

// Get badge details
export const getBadgeDetails = async (req, res) => {
  const badgeDetails = {
    first_video: {
      title: "First Step",
      description: "Watched your first video",
      icon: "🎬",
      color: "#4CAF50"
    },
    video_watcher_5: {
      title: "Video Enthusiast",
      description: "Watched 5 videos",
      icon: "📺",
      color: "#2196F3"
    },
    video_watcher_10: {
      title: "Video Explorer",
      description: "Watched 10 videos",
      icon: "🔍",
      color: "#9C27B0"
    },
    video_watcher_25: {
      title: "Video Connoisseur",
      description: "Watched 25 videos",
      icon: "🏆",
      color: "#FF9800"
    },
    video_watcher_50: {
      title: "Video Master",
      description: "Watched 50 videos",
      icon: "⭐",
      color: "#F44336"
    },
    video_watcher_100: {
      title: "Video Legend",
      description: "Watched 100 videos",
      icon: "👑",
      color: "#E91E63"
    },
    first_playlist: {
      title: "Playlist Pioneer",
      description: "Completed your first playlist",
      icon: "🎯",
      color: "#673AB7"
    },
    playlist_master_5: {
      title: "Playlist Adept",
      description: "Completed 5 playlists",
      icon: "🌟",
      color: "#3F51B5"
    },
    playlist_master_10: {
      title: "Playlist Champion",
      description: "Completed 10 playlists",
      icon: "🏅",
      color: "#009688"
    },
    streak_3: {
      title: "Consistent Learner",
      description: "Watched videos for 3 days in a row",
      icon: "🔥",
      color: "#FF5722"
    },
    streak_7: {
      title: "Weekly Warrior",
      description: "Watched videos for 7 days in a row",
      icon: "📅",
      color: "#795548"
    },
    streak_14: {
      title: "Dedicated Student",
      description: "Watched videos for 14 days in a row",
      icon: "📚",
      color: "#607D8B"
    },
    streak_30: {
      title: "Knowledge Seeker",
      description: "Watched videos for 30 days in a row",
      icon: "🧠",
      color: "#8BC34A"
    }
  };

  res.status(StatusCodes.OK).json({ badgeDetails });
};
