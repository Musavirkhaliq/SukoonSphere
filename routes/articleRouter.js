import express from "express";
import { 
  getAllArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  getSingleArticle,
  getArticlesByUserId,
  likeArticle 
} from "../controllers/articleControllers.js";
import {
  createArticleComment,
  getAllCommentsByArticleId,
  createArticleReply,
  getAllRepliesByCommentId,
  deleteArticleComment,
  deleteArticleReply,
  likeArticleComment,
  likeArticleReply,
  updateArticleComment,
  updateArticleReply
} from "../controllers/articleCommentControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/user/:userId", getArticlesByUserId);
router.get("/:id", getSingleArticle);
router.get("/:articleId/comments", getAllCommentsByArticleId);
router.get("/comments/:commentId/replies", getAllRepliesByCommentId);

// Protected routes
router.post("/", authenticateUser, upload.single("image"), createArticle);
router.put("/:id", authenticateUser, upload.single("image"), updateArticle);
router.delete("/:id", authenticateUser, deleteArticle);
router.patch("/:id/like", authenticateUser, likeArticle);

// Comment routes
router.post("/:articleId/comments", authenticateUser, createArticleComment);
router.patch("/comments/:commentId", authenticateUser, updateArticleComment);
router.delete("/comments/:commentId", authenticateUser, deleteArticleComment);
router.patch("/comments/:commentId/like", authenticateUser, likeArticleComment);

// Reply routes
router.post("/comments/:commentId/replies", authenticateUser, createArticleReply);
router.patch("/replies/:replyId", authenticateUser, updateArticleReply);
router.delete("/replies/:replyId", authenticateUser, deleteArticleReply);
router.patch("/replies/:replyId/like", authenticateUser, likeArticleReply);

export default router;