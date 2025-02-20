import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getMessages, sendMessage, markMessagesAsSeen, deleteAllMessages } from '../controllers/messageController.js';
import { upload } from '../utils/chats.js';

const router = express.Router();

router.post("/", authenticateUser, upload.array('files', 5), sendMessage);
router.get("/:chatId", authenticateUser, getMessages);
router.patch("/mark-as-seen/:chatId", authenticateUser, markMessagesAsSeen);
router.delete("/", deleteAllMessages);

export default router;