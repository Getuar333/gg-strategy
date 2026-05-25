import Notification from '../models/Notification.js';
import { sendEmail } from '../config/email.js';
import User from '../models/User.js';

export class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.userId;
      const { unreadOnly = false } = req.query;

      const notifications = await Notification.getUserNotifications(userId, unreadOnly === 'true');

      res.status(200).json({ notifications });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  }
  static async markAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const marked = await Notification.markAsRead(id, userId);

      if (!marked) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ message: 'Failed to mark notification' });
    }
  }
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.userId;

      const count = await Notification.markAllAsRead(userId);

      res.status(200).json({ message: `${count} notifications marked as read` });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ message: 'Failed to mark notifications' });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const deleted = await Notification.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ message: 'Failed to delete notification' });
    }
  }

  static async sendPendingNotifications() {
    try {
      const pendingNotifications = await Notification.getPendingNotifications();

      for (const notification of pendingNotifications) {
        try {
          const emailHtml = `
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            <p style="margin-top: 20px; color: #666;">
              This is an automated notification from G.G Strategy
            </p>
          `;
          await sendEmail(
            notification.email,
            `G.G Strategy - ${notification.title}`,
            emailHtml
          );

          await Notification.markEmailSent(notification.id);
          console.log(`✅ Email sent to ${notification.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${notification.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Send pending notifications error:', error);
    }
  }
}
export default NotificationController;
export const sendPendingNotifications = async () => {
  try {
    await NotificationController.sendPendingNotifications();
  } catch (error) {
    console.error("sendPendingNotifications error:", error);
  }
};