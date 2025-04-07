import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  handleTherapyMessage,
  getTherapySessions,
  getTherapySession,
  startNewTherapySession,
  completeTherapySession,
  getAssessmentQuestions,
  submitAssessmentResponses,
  createActionPlan,
  updateActionPlanTask,
  initializeAssessmentData
} from "../controllers/therapyController.js";

const router = Router();

// Message handling
router.post("/message", authenticateUser, handleTherapyMessage);

// Session management
router.get("/sessions", authenticateUser, getTherapySessions);
router.get("/sessions/:sessionId", authenticateUser, getTherapySession);
router.post("/sessions/new", authenticateUser, startNewTherapySession);
router.post("/sessions/:sessionId/complete", authenticateUser, completeTherapySession);

// Assessments
router.get("/assessments", getAssessmentQuestions);
router.post("/assessments/submit", authenticateUser, submitAssessmentResponses);

// Action plans
router.post("/action-plans", authenticateUser, createActionPlan);
router.patch("/action-plans/tasks", authenticateUser, updateActionPlanTask);

// Admin routes
router.post("/admin/initialize-assessments", initializeAssessmentData);

export default router;
