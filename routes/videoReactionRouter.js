import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import {
  reactToVideo,
  getVideoReactions
} from "../controllers/videoReactionController.js";

const router = Router();

// React to a video
router.post("/:videoId", authenticateUser, reactToVideo);

// Get reactions for a video
router.get("/:videoId", optionalAuthenticateUser, getVideoReactions);

export default router;
