// routes/notificationRoutes.js
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getUserChats, startChat,deleteAllChats,acceptChatRequest } from '../controllers/chatController.js';

const router = express.Router();
router.post("/", authenticateUser, startChat);
router.get("/", authenticateUser, getUserChats);
router.delete("/", deleteAllChats);
router.patch("/accept-chat-request/:chatId", authenticateUser, acceptChatRequest);

export default router;

