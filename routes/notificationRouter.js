// routes/notificationRouter.js
import express from "express";
import {
  createNotification,
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
  totalNotificationCount,
  markNotificationsAsSeen,
  markNotificationAsSeen
} from "../controllers/notificationController.js";
import {
  authenticateUser,
  optionalAuthenticateUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new notification
router.post("/", authenticateUser, createNotification);

// Get notifications for a user
router.get("/:userId", authenticateUser, getNotifications);

// Get total unread notification count
router.get("/total/:userId", optionalAuthenticateUser, totalNotificationCount);

// Mark all notifications as seen
router.patch("/mark-as-seen", authenticateUser, markNotificationsAsSeen);

// Mark a specific notification as seen
router.patch("/:notificationId/mark-as-seen", authenticateUser, markNotificationAsSeen);

// Delete a specific notification
router.delete("/:notificationId", authenticateUser, deleteNotification);

// Delete all notifications for the authenticated user
router.delete("/", authenticateUser, deleteAllNotifications);

export default router;
