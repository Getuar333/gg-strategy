import pool from '../config/database.js';

export class Notification {
  static async create(userId, notificationData) {
    try {
      const {
        taskId,
        meetingId,
        notificationType,
        title,
        message,
        scheduledTime
      } = notificationData;
      const [result] = await pool.query(
        `INSERT INTO notifications 
        (user_id, task_id, meeting_id, notification_type, title, message, scheduled_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, taskId || null, meetingId || null, notificationType, title, message, scheduledTime]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  static async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = 'SELECT * FROM notifications WHERE user_id = ?';
      const params = [userId];

      if (unreadOnly) {
        query += ' AND is_read = 0';
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async markAsRead(id, userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  static async markEmailSent(id) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET email_sent = 1 WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async getPendingNotifications() {
    try {
      const [rows] = await pool.query(
        `SELECT n.*, u.email 
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.email_sent = 0 
        AND n.scheduled_time <= NOW()
        ORDER BY n.scheduled_time ASC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
export default Notification;