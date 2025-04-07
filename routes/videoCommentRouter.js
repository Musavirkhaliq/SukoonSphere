import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import {
  createComment,
  getVideoComments,
  likeComment,
  deleteComment,
  updateComment,
  createReply,
  getAllRepliesByCommentId,
  updateReply,
  deleteReply,
  likeReply
} from "../controllers/videoCommentController.js";

const router = Router();

// Comment routes
router.post("/:videoId/comments", authenticateUser, createComment);
router.get("/:videoId/comments", optionalAuthenticateUser, getVideoComments);
router.patch("/comments/:commentId", authenticateUser, updateComment);
router.delete("/comments/:commentId", authenticateUser, deleteComment);
router.patch("/comments/:commentId/like", authenticateUser, likeComment);

// Reply routes
router.post("/comments/:commentId/replies", authenticateUser, createReply);
router.get("/comments/:commentId/replies", getAllRepliesByCommentId);
router.patch("/replies/:replyId", authenticateUser, updateReply);
router.delete("/replies/:replyId", authenticateUser, deleteReply);
router.patch("/replies/:replyId/like", authenticateUser, likeReply);

// Legacy routes for backward compatibility
router.post("/", authenticateUser, (req, res, next) => {
  req.params.videoId = req.body.videoId;
  next();
}, createComment);
router.get("/video/:videoId", optionalAuthenticateUser, getVideoComments);
router.post("/:commentId/like", authenticateUser, (req, res, next) => {
  req.params.commentId = req.params.commentId;
  next();
}, likeComment);
router.delete("/:commentId", authenticateUser, deleteComment);
router.patch("/:commentId", authenticateUser, updateComment);

export default router;
