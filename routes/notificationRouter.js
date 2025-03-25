// routes/notificationRoutes.js
import express from "express";
import {
  createNotification,
  getNotifications,
  deleteAllNotifications,
  totalNotificationCount,
  markNotificationsAsSeen
} from "../controllers/notificationController.js";
import {
  authenticateUser,
  optionalAuthenticateUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createNotification);
router.get("/:userId", authenticateUser, getNotifications);
router.delete("/", deleteAllNotifications);
router.get("/total/:userId", optionalAuthenticateUser, totalNotificationCount);
router.patch("/mark-as-seen", authenticateUser, markNotificationsAsSeen);

export default router;
