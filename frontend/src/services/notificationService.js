import api from './apiClient.js';

export const notificationService = {
  // Get notifications
  getNotifications: async (unreadOnly = false) => {
    const response = await api.get('/notifications', {
      params: { unreadOnly }
    });
    return response.data.notifications;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;
