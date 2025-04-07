import express from "express";
import {
  handleChatMessage,
  handleStreamingChatMessage,
  getChatHistory,
  startNewConversation,
  getUserConversations,
  getConversationMessages
} from "../controllers/chatbotController.js";
import { optionalAuthenticateUser, authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (with optional authentication)
// This allows both logged-in and guest users to use the chatbot
// but only logged-in users will have their conversations saved
router.post("/message", optionalAuthenticateUser, handleChatMessage);
router.post("/stream", optionalAuthenticateUser, handleStreamingChatMessage);

// Protected routes (require authentication)
router.get("/history", authenticateUser, getChatHistory);
router.post("/new-conversation", authenticateUser, startNewConversation);
router.get("/conversations", authenticateUser, getUserConversations);
router.get("/conversations/:conversationId", authenticateUser, getConversationMessages);

export default router;
