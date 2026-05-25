import pool from '../config/database.js';

export class Meeting {
  static async create(userId, meetingData) {
    try {
      const {
        title,
        description,
        location,
        meetingDate,
        startTime,
        endTime,
        attendees,
        meetingLink
      } = meetingData;

      const [result] = await pool.query(
        `INSERT INTO meetings 
        (user_id, title, description, location, meeting_date, start_time, end_time, attendees, meeting_link) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, location, meetingDate, startTime, endTime, attendees, meetingLink]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getUserMeetings(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM meetings 
        WHERE user_id = ? 
        ORDER BY meeting_date ASC, start_time ASC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM meetings WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, meetingData) {
    try {
      const {
        title,
        description,
        location,
        meetingDate,
        startTime,
        endTime,
        attendees,
        meetingLink
      } = meetingData;

      const [result] = await pool.query(
        `UPDATE meetings 
        SET title = ?, description = ?, location = ?, meeting_date = ?, 
            start_time = ?, end_time = ?, attendees = ?, meeting_link = ?
        WHERE id = ? AND user_id = ?`,
        [title, description, location, meetingDate, startTime, endTime, attendees, meetingLink, id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM meetings WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getMeetingsByDate(userId, date) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM meetings WHERE user_id = ? AND meeting_date = ? ORDER BY start_time ASC',
        [userId, date]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUpcomingMeetings(userId, days = 7) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM meetings 
        WHERE user_id = ? AND meeting_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        ORDER BY meeting_date ASC, start_time ASC
        LIMIT 10`,
        [userId, days]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
export default Meeting;