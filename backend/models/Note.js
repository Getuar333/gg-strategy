import pool from '../config/database.js';

export class Note {
  static async create(userId, noteData) {
    try {
      const { title, content, type, tags, color } = noteData;
      const [result] = await pool.query(
        `INSERT INTO notes (user_id, title, content, type, tags, color) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, title, content, type || 'note', tags || '', color || '#3b82f6']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  static async getUserNotes(userId, type = null) {
    try {
      let query = 'SELECT * FROM notes WHERE user_id = ?';
      const params = [userId];

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async getById(id, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async update(id, userId, noteData) {
    try {
      const { title, content, type, tags, color } = noteData;
      const [result] = await pool.query(
        `UPDATE notes 
        SET title = ?, content = ?, type = ?, tags = ?, color = ?
        WHERE id = ? AND user_id = ?`,
        [title, content, type || 'note', tags || '', color || '#3b82f6', id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM notes WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  static async search(userId, query) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM notes 
        WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)
        ORDER BY created_at DESC`,
        [userId, `%${query}%`, `%${query}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
export default Note;