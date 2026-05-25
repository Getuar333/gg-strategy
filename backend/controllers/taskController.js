import Task from '../models/Task.js';
import ProductivityStats from '../models/ProductivityStats.js';

export class TaskController {
  static async createTask(req, res) {
    try {
      const userId = req.user.userId;
      const { title, description, priority, category, dueDate, startTime, endTime, colorLabel } = req.body;

      if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required' });
      }
      const taskId = await Task.create(userId, {
        title,
        description: description || '',
        priority: priority || 'medium',
        category: category || 'general',
        dueDate,
        startTime: startTime || null,
        endTime: endTime || null,
        colorLabel: colorLabel || '#3b82f6'
      });
      const createdTask = await Task.getById(taskId, userId);
      res.status(201).json({
        message: 'Task created successfully',
        task: createdTask
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  }
  static async getTasks(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;
      const tasks = await Task.getUserTasks(userId, status || null);
      console.log(`GetTasks: userId=${userId}, count=${Array.isArray(tasks)?tasks.length:0}`);
      if (Array.isArray(tasks) && tasks.length > 0) console.log('First task:', tasks[0]);
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
      const { title, description, priority, category, dueDate, startTime, endTime, status, colorLabel } = req.body;
      if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required' });
      }
      const updated = await Task.update(id, userId, {
        title,
        description: description || '',
        priority: priority || 'medium',
        category: category || 'general',
        dueDate,
        startTime: startTime || null,
        endTime: endTime || null,
        status: status || 'pending',
        colorLabel: colorLabel || '#3b82f6'
      });
      if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // Fetch and return the updated task
      const updatedTask = await Task.getById(id, userId);
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Failed to update task' });
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

      const tasks = await Task.getTasksByDate(userId, date);

      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Get tasks by date error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
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
      res.status(200).json({ message: 'Task marked as complete' });
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
      const tasks = await Task.getTasksByDateRange(userId, startDate, endDate);
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Get tasks by date range error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  }
}
export default TaskController;