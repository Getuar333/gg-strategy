import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gg_strategy',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Sukses: Lidhja me bazën e të dhënave u realizua!');
    connection.release();
  } catch (error) {
    console.error('Gabim: Lidhja me bazën e të dhënave dështoi:', error);
    process.exit(1);
  }
};

export default pool;
