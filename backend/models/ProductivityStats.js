import pool from '../config/database.js';

export class ProductivityStats {
  static async getTodayStats(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [rows] = await pool.query(
        'SELECT * FROM productivity_stats WHERE user_id = ? AND stat_date = ?',
        [userId, today]
      );
      if (rows.length > 0) {
        return rows[0];
      }
      await pool.query(
        'INSERT INTO productivity_stats (user_id, stat_date) VALUES (?, ?)',
        [userId, today]
      );
      const [newRows] = await pool.query(
        'SELECT * FROM productivity_stats WHERE user_id = ? AND stat_date = ?',
        [userId, today]
      );
      return newRows[0];
    } catch (error) {
      throw error;
    }
  }
  static async getStatsRange(userId, startDate, endDate) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM productivity_stats 
        WHERE user_id = ? AND stat_date BETWEEN ? AND ?
        ORDER BY stat_date ASC`,
        [userId, startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async updateStats(userId, statsData) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const {
        totalTasks,
        completedTasks,
        totalMeetings,
        attendedMeetings,
        productivityScore,
        focusHours
      } = statsData;
      const [result] = await pool.query(
        `UPDATE productivity_stats 
        SET total_tasks = ?, completed_tasks = ?, total_meetings = ?, 
            attended_meetings = ?, productivity_score = ?, focus_hours = ?
        WHERE user_id = ? AND stat_date = ?`,
        [totalTasks, completedTasks, totalMeetings, attendedMeetings, productivityScore, focusHours, userId, today]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async calculateStats(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [taskResults] = await pool.query(
        `SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
        FROM tasks 
        WHERE user_id = ? AND due_date = ?`,
        [userId, today]
      );
      const [meetingResults] = await pool.query(
        `SELECT COUNT(*) as total_meetings
        FROM meetings 
        WHERE user_id = ? AND meeting_date = ?`,
        [userId, today]
      );
      const taskStats = taskResults[0];
      const meetingStats = meetingResults[0];
      const totalTasks = taskStats.total_tasks || 0;
      const completedTasks = taskStats.completed_tasks || 0;
      const totalMeetings = meetingStats.total_meetings || 0;
      const productivityScore = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
      await this.updateStats(userId, {
        totalTasks,
        completedTasks,
        totalMeetings,
        attendedMeetings: 0,
        productivityScore,
        focusHours: 0
      });
      return {
        totalTasks,
        completedTasks,
        totalMeetings,
        productivityScore
      };
    } catch (error) {
      throw error;
    }
  }
}

export default ProductivityStats;