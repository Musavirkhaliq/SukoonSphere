import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post("/", authenticateUser, sendMessage);
router.get("/:chatId", authenticateUser, getMessages);

export default router;