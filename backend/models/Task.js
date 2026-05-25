import pool from '../config/database.js';
export class Task {
  static async create(userId, taskData) {
    try {
      const {
        title,
        description,
        priority,
        category,
        dueDate,
        startTime,
        endTime,
        colorLabel
      } = taskData;
      const [result] = await pool.query(
        `INSERT INTO tasks 
        (user_id, title, description, priority, category, due_date, start_time, end_time, color_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, priority, category, dueDate, startTime, endTime, colorLabel]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  static async getUserTasks(userId, status = null) {
    try {
      let query = 'SELECT * FROM tasks WHERE user_id = ?';
      const params = [userId];
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      query += ' ORDER BY due_date ASC, start_time ASC';
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async getById(id, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async update(id, userId, taskData) {
    try {
      const { title, description, priority, category, dueDate, startTime, endTime, status, colorLabel } = taskData;
      const [result] = await pool.query(
        `UPDATE tasks 
        SET title = ?, description = ?, priority = ?, category = ?, 
            due_date = ?, start_time = ?, end_time = ?, status = ?, color_label = ?
        WHERE id = ? AND user_id = ?`,
        [title, description, priority, category, dueDate, startTime, endTime, status, colorLabel, id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async getTasksByDate(userId, date) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM tasks WHERE user_id = ? AND due_date = ? ORDER BY start_time ASC',
        [userId, date]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async getTasksByDateRange(userId, startDate, endDate) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM tasks 
        WHERE user_id = ? AND due_date BETWEEN ? AND ? 
        ORDER BY due_date ASC, start_time ASC`,
        [userId, startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async getUpcomingTasks(userId, days = 7) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM tasks 
        WHERE user_id = ? AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND status != 'completed'
        ORDER BY due_date ASC, start_time ASC
        LIMIT 10`,
        [userId, days]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async markComplete(id, userId) {
    try {
      const [result] = await pool.query(
        'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
        ['completed', id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
export default Task;