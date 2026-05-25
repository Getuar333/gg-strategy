import express from 'express';
import NoteController from '../controllers/noteController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', NoteController.createNote);
router.get('/', NoteController.getNotes);
router.get('/search', NoteController.searchNotes);
router.get('/:id', NoteController.getNoteById);
router.put('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

export default router;
