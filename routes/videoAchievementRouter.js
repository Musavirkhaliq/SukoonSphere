import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getUserAchievements,
  getUnseenBadges,
  markBadgesAsSeen,
  checkPlaylistCompletion,
  updateVideoWatched,
  getBadgeDetails
} from "../controllers/videoAchievementController.js";

const router = Router();

// Get user's video achievements
router.get("/", authenticateUser, getUserAchievements);

// Get user's unseen badges
router.get("/unseen-badges", authenticateUser, getUnseenBadges);

// Mark badges as seen
router.post("/mark-badges-seen", authenticateUser, markBadgesAsSeen);

// Check if a playlist is completed
router.get("/check-playlist/:playlistId", authenticateUser, checkPlaylistCompletion);

// Update video watched achievement
router.post("/video-watched", authenticateUser, updateVideoWatched);

// Get badge details
router.get("/badge-details", getBadgeDetails);

export default router;
