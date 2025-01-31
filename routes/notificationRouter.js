// routes/notificationRoutes.js
import express from 'express';
import { createNotification, getNotifications, deleteAllNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/:userId', getNotifications);
router.delete('/', deleteAllNotifications);

export default router;