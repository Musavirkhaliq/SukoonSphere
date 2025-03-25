// controllers/notificationController.js
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js"; // Assuming you export io from server.js

export const createNotification = async (req, res) => {
  try {
    const { userId, postId, type, message } = req.body;

    const notification = new Notification({ userId, postId, type, message });
    await notification.save();

    // Emit the notification to connected clients
    io.emit("notification", notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .populate("postId", "_id  imageUrl")
      .populate("userId", "name avatar")
      .populate("createdBy", "_id name avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const markNotificationsAsSeen = async (req, res) => {
  try {
    await Notification.updateMany({
      userId: req.user.userId,
      seen: false,
    }, {
      $set: { seen: true },
    });
io.to(req.user.userId.toString()).emit('notificationCount', 0);
    res.status(200).json({ message: "Notifications marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const totalNotificationCount = async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ count: 0 });
  }
  const { userId } = req.user;
  const count = await Notification.countDocuments({ userId, seen: false });
  res.status(200).json({ count });
};
