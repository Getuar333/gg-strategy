import Note from '../models/Note.js';
export class NoteController {
  static async createNote(req, res) {
    try {
      const userId = req.user.userId;
      const { title, content, type, tags, color } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }
      const noteId = await Note.create(userId, {
        title,
        content,
        type: type || 'note',
        tags: tags || '',
        color: color || '#3b82f6'
      });
      const createdNote = await Note.getById(noteId, userId);
      res.status(201).json({
        message: 'Note created successfully',
        note: createdNote
      });
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({ message: 'Failed to create note' });
    }
  }
  static async getNotes(req, res) {
    try {
      const userId = req.user.userId;
      const { type } = req.query;
      const notes = await Note.getUserNotes(userId, type || null);
      res.status(200).json({ notes });
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({ message: 'Failed to fetch notes' });
    }
  }
  static async getNoteById(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const note = await Note.getById(id, userId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json({ note });
    } catch (error) {
      console.error('Get note error:', error);
      res.status(500).json({ message: 'Failed to fetch note' });
    }
  }
  static async updateNote(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { title, content, type, tags, color } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }
      const updated = await Note.update(id, userId, {
        title,
        content,
        type: type || 'note',
        tags: tags || '',
        color: color || '#3b82f6'
      });
      if (!updated) {
        return res.status(404).json({ message: 'Note not found' });
      }
      const updatedNote = await Note.getById(id, userId);
      res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({ message: 'Failed to update note' });
    }
  }
  static async deleteNote(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const deleted = await Note.delete(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json({ message: 'Note deleted successfully', success: true, id });
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({ message: 'Failed to delete note' });
    }
  }
  static async searchNotes(req, res) {
    try {
      const userId = req.user.userId;
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      const notes = await Note.search(userId, q);
      res.status(200).json({ notes });
    } catch (error) {
      console.error('Search notes error:', error);
      res.status(500).json({ message: 'Failed to search notes' });
    }
  }
}
export default NoteController;