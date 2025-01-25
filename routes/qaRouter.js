import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  addQuestion,
  createAnswer,
  createAnswerComment,
  createAnswerReply,
  deleteAnswer,
  deleteAnswerComment,
  deleteAnswerReply,
  deleteQuestion,
  editAnswer,
  editAnswerComment,
  editAnswerReply,
  getAllAnswerRepliesByCommentId,
  getAllCommentsByAnswerId,
  getAllQuestions,
  getAllQuestionsWithAnswer,
  getAnswersByQuestionId,
  getUserAnswers,
  getUserQuestions,
  likeAnswer,
  likeAnswerComment,
  likeAnswerReply,
  getAnswerById,
} from "../controllers/qaController.js";
import {
  validateAnswerInput,
  validateIdParam,
  validateQaCommentInput,
  validateQaSectionInput,
} from "../middleware/validationMiddleware.js";
const router = Router();
// question routes
router.post("/", authenticateUser, validateQaSectionInput, addQuestion);
router.get("/all-questions", getAllQuestions);
router.get("/", getAllQuestionsWithAnswer);
router.get("/user-questions/:id", getUserQuestions);
// answerComment routes
router.post(
  "/answer/:id/add-comment",
  authenticateUser,
  validateIdParam,
  validateQaCommentInput,
  createAnswerComment
);
router.get(
  "/answer/:id/all-comments",
  validateIdParam,
  getAllCommentsByAnswerId
);
router.get("/answer/:id", validateIdParam, getAnswerById);
router.patch(
  "/answer/:id",
  authenticateUser,
  validateIdParam,
  validateAnswerInput,
  editAnswer
);
router.post(
  "/answer/comments/:id/replies",
  authenticateUser,
  validateIdParam,
  validateQaCommentInput,
  createAnswerReply
);
router.get(
  "/answer/comments/:id/replies",
  validateIdParam,
  getAllAnswerRepliesByCommentId
);

// Edit routes for comments and replies
router.patch(
  "/answer/comments/:id",
  authenticateUser,
  validateIdParam,
  validateQaCommentInput,
  editAnswerComment
);

router.patch(
  "/answer/comments/replies/:id",
  authenticateUser,
  validateIdParam,
  validateQaCommentInput,
  editAnswerReply
);

// answer routes
router.post(
  "/question/:id/add-answer",
  authenticateUser,
  validateIdParam,
  validateAnswerInput,
  createAnswer
);
router.get("/question/:id/answers", validateIdParam, getAnswersByQuestionId);
router.get("/user-answers/:id", validateIdParam, getUserAnswers);
router.delete(
  "/question/:id",
  authenticateUser,
  validateIdParam,
  deleteQuestion
);
router.delete(
  "/question/answer/:id",
  authenticateUser,
  validateIdParam,
  deleteAnswer
);
router.delete(
  "/question/answer/comments/:id",
  authenticateUser,
  validateIdParam,
  deleteAnswerComment
);
router.delete(
  "/question/answer/comments/reply/:id",
  authenticateUser,
  validateIdParam,
  deleteAnswerReply
);
// like routes
router.patch(
  "/question/answer/:id/like",
  authenticateUser,
  validateIdParam,
  likeAnswer
);
router.patch(
  "/question/answer/comments/:id/like",
  authenticateUser,
  validateIdParam,
  likeAnswerComment
);
router.patch(
  "/question/answer/comments/reply/:id/like",
  authenticateUser,
  validateIdParam,
  likeAnswerReply
);
export default router;
