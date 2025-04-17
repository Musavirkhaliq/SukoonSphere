import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import { profileMiddleware } from "../middleware/profileMiddleware.js";
import {
  AcceptContributorsRequest,
  changeUserProfile,
  deleteContributorsRequest,
  followOrUnfollowUser,
  getAllContributors,
  getAllContributorsRequests,
  getAllFollowers,
  getAllFollowing,
  getMostLikedContent,
  getUserDetailsById,
  getUserProfile,
  requestContributor,
  verifyContributor,
  createSuggestion,
  deleteSuggestion,
  updateSuggestionStatus,
  userSuggestions,
  getUserGamification,
  getUserAchievementsById,
  getAnonymousPosts,
  getAnonymousStories,
  getAnonymousQuestions,
  getAnonymousAnswers
} from "../controllers/userController.js";
import { searchUsers, checkFollowing } from "../controllers/userSearchController.js";
import upload from "../middleware/multer.js";

const router = Router();

router.patch(
  "/change-profile",
  authenticateUser,
  upload.single("avatar"),
  changeUserProfile
);
router.post("/follow/:id", authenticateUser, followOrUnfollowUser);
router.post("/unfollow/:id", authenticateUser, followOrUnfollowUser);
router.get("/followers/:id", getAllFollowers);
router.get("/following/:id", getAllFollowing);
router.get("/profile", profileMiddleware(), getUserProfile);
router.get("/user-details/:id", getUserDetailsById);

// Contributor request management routes
router.post("/verify-contributor", authenticateUser, verifyContributor);
router.post("/request-contributor", authenticateUser, requestContributor);
router.get("/contributor-requests", authenticateUser, getAllContributorsRequests);
router.delete("/contributor-request/:id", authenticateUser, deleteContributorsRequest);
router.patch("/accept-contributor/:id", authenticateUser, AcceptContributorsRequest);
router.get("/all-contributors", getAllContributors);

// home
router.get("/get-most-liked-content", getMostLikedContent);

// Suggestion routes
router.get('/suggestions', authenticateUser, profileMiddleware(['admin']), userSuggestions);
router.post('/suggestions', authenticateUser, createSuggestion);
router.delete('/suggestions/:suggestionId', authenticateUser, profileMiddleware(['admin']), deleteSuggestion);
router.patch('/suggestions/:suggestionId/status', authenticateUser, profileMiddleware(['admin']), updateSuggestionStatus);

// Gamification routes
router.get('/gamification', authenticateUser, getUserGamification);
router.get('/achievements/:id', getUserAchievementsById);

// User search routes
router.get('/search', searchUsers);
router.get('/check-following/:userId', authenticateUser, checkFollowing);

// Anonymous content routes
router.get('/anonymous-content/posts', authenticateUser, getAnonymousPosts);
router.get('/anonymous-content/stories', authenticateUser, getAnonymousStories);
router.get('/anonymous-content/question', authenticateUser, getAnonymousQuestions);
router.get('/anonymous-content/answer', authenticateUser, getAnonymousAnswers);

export default router;
