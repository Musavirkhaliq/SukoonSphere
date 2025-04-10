import express from "express";
import {
  getAllPersonalStories,
  createPersonalStory,
  updatePersonalStory,
  deletePersonalStory,
  getSinglePersonalStory,
  getPersonalStoriesByUserId,
  likePersonalStory,
  getMostLikedPersonalStories
} from "../controllers/personalStoryControllers.js";
import {
  createPersonalStoryComment,
  getAllCommentsByStoryId,
  createPersonalStoryReply,
  getAllRepliesByCommentId,
  deletePersonalStoryComment,
  deletePersonalStoryReply,
  likePersonalStoryComment,
  likePersonalStoryReply,
  updatePersonalStoryComment,
  updatePersonalStoryReply
} from "../controllers/personalStoryCommentControllers.js";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import { trackContentView } from "../middleware/activityTrackingMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPersonalStories);
router.get("/most-liked", getMostLikedPersonalStories);
router.get("/user/:userId", getPersonalStoriesByUserId);
router.get("/:id", optionalAuthenticateUser, trackContentView, getSinglePersonalStory);
router.get("/:storyId/comments", getAllCommentsByStoryId);
router.get("/comments/:commentId/replies", getAllRepliesByCommentId);

// Protected routes
router.post("/", authenticateUser, upload.single("image"), createPersonalStory);
router.put("/:id", authenticateUser, upload.single("image"), updatePersonalStory);
router.delete("/:id", authenticateUser, deletePersonalStory);
router.patch("/:id/like", authenticateUser, likePersonalStory);

// Comment routes
router.post("/:storyId/comments", authenticateUser, createPersonalStoryComment);
router.post("/comments/:commentId/replies", authenticateUser, createPersonalStoryReply);
router.delete("/comments/:commentId", authenticateUser, deletePersonalStoryComment);
router.delete("/replies/:replyId", authenticateUser, deletePersonalStoryReply);
router.patch("/comments/:commentId/like", authenticateUser, likePersonalStoryComment);
router.patch("/replies/:replyId/like", authenticateUser, likePersonalStoryReply);
router.patch("/comments/:commentId", authenticateUser, updatePersonalStoryComment);
router.patch("/replies/:replyId", authenticateUser, updatePersonalStoryReply);

export default router;
