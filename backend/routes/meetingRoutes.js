import express from 'express';
import MeetingController from '../controllers/meetingController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', MeetingController.createMeeting);
router.get('/', MeetingController.getMeetings);
router.get('/upcoming', MeetingController.getUpcomingMeetings);
router.get('/date/:date', MeetingController.getMeetingsByDate);
router.get('/:id', MeetingController.getMeetingById);
router.put('/:id', MeetingController.updateMeeting);
router.delete('/:id', MeetingController.deleteMeeting);

export default router;
