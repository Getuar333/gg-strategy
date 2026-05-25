import api from './apiClient.js';

export const taskService = {
  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    // backend now returns { message, task }
    return response.data.task;
  },

  // Get all tasks
  getTasks: async (status = null) => {
    const response = await api.get('/tasks', {
      params: { status }
    });

    // debug: log raw payload
    // eslint-disable-next-line no-console
    console.debug('[taskService] getTasks response.data:', response.data);

    // backend returns: { tasks: [...] }
    return response.data.tasks || [];
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.task;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    // backend returns { message, task }
    return response.data.task;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    // backend returns { message, success, id }
    return response.data;
  },

  // Get tasks by date
  getTasksByDate: async (date) => {
    const response = await api.get(`/tasks/date/${date}`);
    return response.data.tasks;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (days = 7) => {
    const response = await api.get('/tasks/upcoming', {
      params: { days }
    });
    return response.data.tasks;
  },

  // Get tasks by date range
  getTasksByDateRange: async (startDate, endDate) => {
    const response = await api.get('/tasks/range', {
      params: { startDate, endDate }
    });
    return response.data.tasks;
  },

  // Mark task as complete
  markTaskComplete: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    // backend returns { message, task }
    return response.data.task;
  }
};

export default taskService;
