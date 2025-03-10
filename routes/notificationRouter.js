// routes/notificationRoutes.js
import express from 'express';
import { createNotification, getNotifications, deleteAllNotifications,totalNotificationCount } from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createNotification);
router.get('/:userId', authenticateUser, getNotifications);
router.delete('/', authenticateUser, deleteAllNotifications);
router.get('/total/:userId', authenticateUser,totalNotificationCount);

export default router;