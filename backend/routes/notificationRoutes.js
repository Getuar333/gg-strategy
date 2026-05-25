import express from 'express';
import NotificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/read-all', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
