import api from './apiClient.js';

export const meetingService = {
  // Create meeting
  createMeeting: async (meetingData) => {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  },

  // Get all meetings
  getMeetings: async () => {
    const response = await api.get('/meetings');
    return response.data.meetings;
  },

  // Get meeting by ID
  getMeetingById: async (id) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data.meeting;
  },

  // Update meeting
  updateMeeting: async (id, meetingData) => {
    const response = await api.put(`/meetings/${id}`, meetingData);
    return response.data;
  },

  // Delete meeting
  deleteMeeting: async (id) => {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  },

  // Get meetings by date
  getMeetingsByDate: async (date) => {
    const response = await api.get(`/meetings/date/${date}`);
    return response.data.meetings;
  },

  // Get upcoming meetings
  getUpcomingMeetings: async (days = 7) => {
    const response = await api.get('/meetings/upcoming', {
      params: { days }
    });
    return response.data.meetings;
  }
};

export default meetingService;
