import express from 'express';
import TaskController from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Task CRUD
router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/upcoming', TaskController.getUpcomingTasks);
router.get('/range', TaskController.getTasksByDateRange);
router.get('/date/:date', TaskController.getTasksByDate);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

router.patch('/:id/complete', TaskController.markTaskComplete);

export default router;
