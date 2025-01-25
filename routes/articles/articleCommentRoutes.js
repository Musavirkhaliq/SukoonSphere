import express from 'express';
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
  updateArticleReply,
} from '../../controllers/articleCommentControllers.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Comment routes
router.post('/articles/:articleId/comments', authenticateUser, createArticleComment);
router.get('/articles/:articleId/comments', getAllCommentsByArticleId);
router.patch('/articles/:articleId/comments/:commentId', authenticateUser, updateArticleComment);
router.delete('/articles/:articleId/comments/:commentId', authenticateUser, deleteArticleComment);
router.post('/articles/:articleId/comments/:commentId/like', authenticateUser, likeArticleComment);

// Reply routes
router.post('/articles/comments/:commentId/replies', authenticateUser, createArticleReply);
router.get('/articles/comments/:commentId/replies', getAllRepliesByCommentId);
router.patch('/articles/comments/:commentId/replies/:replyId', authenticateUser, updateArticleReply);
router.delete('/articles/comments/:commentId/replies/:replyId', authenticateUser, deleteArticleReply);
router.post('/articles/comments/:commentId/replies/:replyId/like', authenticateUser, likeArticleReply);

export default router;
