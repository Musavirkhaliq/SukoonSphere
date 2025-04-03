import express from "express";
import {
  trackActivity,
  getUserActivityHistory,
  getUserPreferences,
  getRecommendations,
  markRecommendationClicked,
  generateRecommendations,
  getPopularContent
} from "../controllers/analyticsController.js";
import {
  authenticateUser,
  optionalAuthenticateUser
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Activity tracking routes
router.post("/track", authenticateUser, trackActivity);
router.get("/activity", authenticateUser, getUserActivityHistory);

// User preferences routes
router.get("/preferences", authenticateUser, getUserPreferences);

// Recommendation routes
router.get("/recommendations", authenticateUser, getRecommendations);
router.post("/recommendations/clicked/:recommendationId", authenticateUser, markRecommendationClicked);
router.post("/recommendations/generate", authenticateUser, generateRecommendations);

// Popular content routes (can be accessed without authentication)
router.get("/popular", optionalAuthenticateUser, getPopularContent);

export default router;
