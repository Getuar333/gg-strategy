import pool from '../config/database.js';
import bcryptjs from 'bcryptjs';

export class User {
  static async create(fullName, email, password) {
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
        [fullName, email, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcryptjs.compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
  static async update(id, fullName, email) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
        [fullName, email, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
export default User;