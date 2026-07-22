import Task from '../models/Task.js';
import ProductivityStats from '../models/ProductivityStats.js';
import { normalizeDateOnly, normalizeTimeOnly } from '../utils/dateOnly.js';

const TASK_PRIORITIES = new Set(['low', 'medium', 'high']);
const TASK_STATUSES = new Set(['pending', 'in_progress', 'completed', 'cancelled']);

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const pick = (source, camelCaseKey, snakeCaseKey) => {
  if (Object.prototype.hasOwnProperty.call(source, camelCaseKey)) {
    return source[camelCaseKey];
  }

  if (snakeCaseKey && Object.prototype.hasOwnProperty.call(source, snakeCaseKey)) {
    return source[snakeCaseKey];
  }

  return undefined;
};

const normalizeTaskPayload = (source, includeStatus = false) => {
  const title = String(pick(source, 'title') || '').trim();
  const dueDate = normalizeDateOnly(pick(source, 'dueDate', 'due_date'), 'dueDate');
  const priority = pick(source, 'priority') || 'medium';
  const status = pick(source, 'status') || 'pending';

  if (!title || !dueDate) {
    throw validationError('Title and due date are required');
  }

  if (!TASK_PRIORITIES.has(priority)) {
    throw validationError('Invalid priority');
  }

  if (includeStatus && !TASK_STATUSES.has(status)) {
    throw validationError('Invalid status');
  }

  return {
    title,
    description: String(pick(source, 'description') || '').trim(),
    priority,
    category: String(pick(source, 'category') || 'general').trim() || 'general',
    dueDate,
    startTime: normalizeTimeOnly(pick(source, 'startTime', 'start_time'), 'startTime'),
    endTime: normalizeTimeOnly(pick(source, 'endTime', 'end_time'), 'endTime'),
    status,
    colorLabel: String(pick(source, 'colorLabel', 'color_label') || '#3b82f6').trim() || '#3b82f6'
  };
};

const sendTaskError = (res, error, fallbackMessage) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(`${fallbackMessage}:`, error);
  return res.status(500).json({ message: fallbackMessage });
};

export class TaskController {
  static async createTask(req, res) {
    try {
      const userId = req.user.userId;
      const taskId = await Task.create(userId, normalizeTaskPayload(req.body));
      const createdTask = await Task.getById(taskId, userId);
      res.status(201).json({
        message: 'Task created successfully',
        task: createdTask
      });
    } catch (error) {
      return sendTaskError(res, error, 'Failed to create task');
    }
  }
  static async getTasks(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;
      const tasks = await Task.getUserTasks(userId, status || null);
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  }
  static async getTaskById(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const task = await Task.getById(id, userId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ message: 'Failed to fetch task' });
    }
  }
  static async updateTask(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const existingTask = await Task.getById(id, userId);

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updated = await Task.update(id, userId, normalizeTaskPayload({ ...existingTask, ...req.body }, true));
      if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = await Task.getById(id, userId);
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      return sendTaskError(res, error, 'Failed to update task');
    }
  }
  static async deleteTask(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const deleted = await Task.delete(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully', success: true, id });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }
  static async getTasksByDate(req, res) {
    try {
      const userId = req.user.userId;
      const { date } = req.params;
      const normalizedDate = normalizeDateOnly(date, 'date');

      const tasks = await Task.getTasksByDate(userId, normalizedDate);

      res.status(200).json({ tasks });
    } catch (error) {
      return sendTaskError(res, error, 'Failed to fetch tasks');
    }
  }
  static async getUpcomingTasks(req, res) {
    try {
      const userId = req.user.userId;
      const { days = 7 } = req.query;
      const tasks = await Task.getUpcomingTasks(userId, days);
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Get upcoming tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  }
  static async markTaskComplete(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const marked = await Task.markComplete(id, userId);

      if (!marked) {
        return res.status(404).json({ message: 'Task not found' });
      }
      await ProductivityStats.calculateStats(userId);
      const updatedTask = await Task.getById(id, userId);
      res.status(200).json({ message: 'Task marked as complete', task: updatedTask });
    } catch (error) {
      console.error('Mark complete error:', error);
      res.status(500).json({ message: 'Failed to mark task' });
    }
  }
  static async getTasksByDateRange(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      const normalizedStartDate = normalizeDateOnly(startDate, 'startDate');
      const normalizedEndDate = normalizeDateOnly(endDate, 'endDate');
      const tasks = await Task.getTasksByDateRange(userId, normalizedStartDate, normalizedEndDate);
      res.status(200).json({ tasks });
    } catch (error) {
      return sendTaskError(res, error, 'Failed to fetch tasks');
    }
  }
}
export default TaskController;
