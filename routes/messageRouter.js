import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getMessages, sendMessage, getActiveUser } from '../controllers/messageController.js';

const router = express.Router();

router.post("/", authenticateUser, sendMessage);
router.get("/:chatId", authenticateUser, getMessages);
router.get("/active-user/:chatId", authenticateUser, getActiveUser);

export default router;