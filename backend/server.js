import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { sendPendingNotifications } from './controllers/notificationController.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

testConnection();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'G.G Strategy Server is running' });
});

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`\nG.G Strategy Backend Server running on http://localhost:${PORT}`);
  console.log('Email notifications: Enabled');
  console.log('JWT Authentication: Active\n');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`);
    console.error('Stop the existing process or change PORT in backend/.env, then run npm run dev again.');
    console.error(`PowerShell helper: netstat -ano | Select-String ':${PORT}'`);
    process.exit(1);
  }

  throw error;
});

setInterval(() => {
  sendPendingNotifications();
}, 60000);

export default app;
