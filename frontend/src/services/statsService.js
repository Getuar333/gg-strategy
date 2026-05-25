import api from './apiClient.js';

export const statsService = {
  // Get today's stats
  getTodayStats: async () => {
    const response = await api.get('/stats/today');
    return response.data.stats;
  },

  // Get stats for date range
  getStatsRange: async (startDate, endDate) => {
    const response = await api.get('/stats/range', {
      params: { startDate, endDate }
    });
    return response.data.stats;
  },

  // Calculate stats
  calculateStats: async () => {
    const response = await api.post('/stats/calculate');
    return response.data.stats;
  }
};

export default statsService;
