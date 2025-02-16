// routes/notificationRoutes.js
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getUserChats, startChat,deleteAllChats } from '../controllers/chatController.js';

const router = express.Router();
router.post("/", authenticateUser, startChat);
router.get("/", authenticateUser, getUserChats);
router.delete("/", deleteAllChats);

export default router;

