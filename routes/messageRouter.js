import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getMessages, sendMessage, markMessagesAsSeen ,deleteAllMessages} from '../controllers/messageController.js';

const router = express.Router();

router.post("/", authenticateUser, sendMessage);
router.get("/:chatId", authenticateUser, getMessages);
router.post("/mark-as-seen", authenticateUser, markMessagesAsSeen);
router.delete("/", deleteAllMessages);

export default router;