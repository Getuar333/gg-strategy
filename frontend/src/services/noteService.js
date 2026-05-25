import api from './apiClient.js';

export const noteService = {
  // Create note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data.note;
  },

  // Get all notes
  getNotes: async (type = null) => {
    const response = await api.get('/notes', {
      params: { type }
    });
    return response.data.notes || [];
  },

  // Get note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data.note;
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data.note;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Search notes
  searchNotes: async (query) => {
    const response = await api.get('/notes/search', {
      params: { q: query }
    });
    return response.data.notes || [];
  }
};

export default noteService;
