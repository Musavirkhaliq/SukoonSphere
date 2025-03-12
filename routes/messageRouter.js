import express from "express";
import {
  authenticateUser,
  optionalAuthenticateUser,
} from "../middleware/authMiddleware.js";
import {
  getMessages,
  sendMessage,
  markMessagesAsSeen,
  totalUnseenMessages,
  deleteAllMessages,
  deleteAllMessagesByChatId,
  deleteMessageById,
} from "../controllers/messageController.js";
import { upload } from "../utils/chats.js";

const router = express.Router();

router.post("/", authenticateUser, upload.array("files", 5), sendMessage);
router.get("/:chatId", authenticateUser, getMessages);
router.patch("/mark-as-seen/:chatId", authenticateUser, markMessagesAsSeen);
router.get(
  "/total-unseen/:userId",
  optionalAuthenticateUser,
  totalUnseenMessages
);
router.delete(
  "/delete-all-by-chat-id/:chatId",
  authenticateUser,
  deleteAllMessagesByChatId
);
router.delete(
  "/delete-message/:messageId/:chatId",
  authenticateUser,
  deleteMessageById
);
router.delete("/", deleteAllMessages);

export default router;
