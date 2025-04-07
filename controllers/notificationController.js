// controllers/notificationController.js
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js"; // Assuming you export io from server.js

export const createNotification = async (req, res) => {
  try {
    const { userId, postId, type, message, createdBy } = req.body;

    // Validate required fields
    if (!userId || !type || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the notification
    const notification = new Notification({
      userId,
      postId,
      type,
      message,
      createdBy: createdBy || req.user.userId
    });

    await notification.save();

    // Populate the notification for the socket emission
    const populatedNotification = await Notification.findById(notification._id)
      .populate("postId", "_id imageUrl")
      .populate("userId", "name avatar")
      .populate("createdBy", "_id name avatar");

    // Emit the notification to the specific user's room
    io.to(userId.toString()).emit("notification", populatedNotification);

    res.status(201).json(populatedNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    // Get notifications for the user
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .populate("postId", "_id imageUrl")
      .populate("userId", "name avatar")
      .populate("createdBy", "_id name avatar")
      .populate("questionId", "_id title")
      .populate("answerId", "_id")
      .populate("articleId", "_id title")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Notification.countDocuments({ userId: req.params.userId });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationsAsSeen = async (req, res) => {
  try {
    // Update all unseen notifications for the user
    const result = await Notification.updateMany(
      {
        userId: req.user.userId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    // Emit notification count update to the user
    io.to(req.user.userId.toString()).emit('notificationCount', 0);

    res.status(200).json({
      message: "Notifications marked as seen",
      updated: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    res.status(500).json({ error: "Failed to mark notifications as seen" });
  }
};

export const markNotificationAsSeen = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find the notification and ensure it belongs to the user
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Mark as seen
    notification.seen = true;
    await notification.save();

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      seen: false
    });

    // Emit updated count
    io.to(req.user.userId.toString()).emit('notificationCount', unreadCount);

    res.status(200).json({
      message: "Notification marked as seen",
      unreadCount
    });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    res.status(500).json({ error: "Failed to mark notification as seen" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find the notification and ensure it belongs to the user
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Delete the notification
    await notification.deleteOne();

    // Get updated unread count if the deleted notification was unread
    if (!notification.seen) {
      const unreadCount = await Notification.countDocuments({
        userId: req.user.userId,
        seen: false
      });

      // Emit updated count
      io.to(req.user.userId.toString()).emit('notificationCount', unreadCount);
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    // Only allow users to delete their own notifications
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Delete all notifications for the user
    await Notification.deleteMany({ userId: req.user.userId });

    // Emit updated count
    io.to(req.user.userId.toString()).emit('notificationCount', 0);

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({ error: "Failed to delete notifications" });
  }
};

export const totalNotificationCount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ count: 0 });
    }

    const { userId } = req.user;
    const count = await Notification.countDocuments({ userId, seen: false });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting notification count:", error);
    res.status(500).json({ error: "Failed to get notification count" });
  }
};
