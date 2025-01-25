import { Router } from "express";
const router = Router();

import {
  validateIdParam,
  validatePostInput,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  createPost,
  createPostComment,
  createReply,
  deletePost,
  deletePostComment,
  deletePostCommentReply,
  getAllCommentsByPostId,
  getAllPosts,
  getAllPostsByUserId,
  getAllRepliesByCommentId,
  likePostComment,
  likePostCommentReply,
  likePosts,
  getPostById,
  updatePost,
  updatePostComment,
  updatePostCommentReply
} from "../controllers/postController.js";

router.post(
  "/",
  authenticateUser,
  upload.single("imageUrl"),
  validatePostInput,
  createPost
);
router.get("/", getAllPosts);
router.get("/:id", validateIdParam, getPostById);
router.patch(
  "/:id",
  authenticateUser,
  upload.single("imageUrl"),
  validateIdParam,
  validatePostInput,
  updatePost
);
router.patch("/:id/like", authenticateUser, validateIdParam, likePosts);
router.patch(
  "/comments/:id/like",
  authenticateUser,
  validateIdParam,
  likePostComment
);
router.patch(
  "/comments/replies/:id/like",
  authenticateUser,
  validateIdParam,
  likePostCommentReply
);
router.post(
  "/:id/comments",
  authenticateUser,
  validateIdParam,
  createPostComment
);
router.patch(
  "/comments/:id",
  authenticateUser,
  validateIdParam,
  updatePostComment
);
router.patch(
  "/comments/replies/:id",
  authenticateUser,
  validateIdParam,
  updatePostCommentReply
);
router.get("/user/:id", validateIdParam, getAllPostsByUserId);
router.get("/:id/comments", validateIdParam, getAllCommentsByPostId);
router.post(
  "/comments/:id/replies",
  authenticateUser,
  validateIdParam,
  createReply
);
router.get("/comments/:id/replies", validateIdParam, getAllRepliesByCommentId);
router.delete("/:id", authenticateUser, validateIdParam, deletePost);
router.delete(
  "/comments/:id",
  authenticateUser,
  validateIdParam,
  deletePostComment
);
router.delete(
  "/comments/replies/:id",
  authenticateUser,
  validateIdParam,
  deletePostCommentReply
);

export default router;
