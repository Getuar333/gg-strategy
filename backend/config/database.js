import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gg_strategy',
  port: process.env.DB_PORT || 3306,
  dateStrings: ['DATE'],
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default pool;
