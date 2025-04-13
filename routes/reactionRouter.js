import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import {
  reactToContent,
  getContentReactions,
  getUsersWhoReacted
} from "../controllers/reactionController.js";

const router = Router();

// React to content
router.post("/:contentType/:contentId", authenticateUser, reactToContent);

// Get reactions for content
router.get("/:contentType/:contentId", optionalAuthenticateUser, getContentReactions);

// Get users who reacted to content
router.get("/:contentType/:contentId/users", getUsersWhoReacted);

export default router;
