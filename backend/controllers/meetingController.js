import Meeting from '../models/Meeting.js';

export class MeetingController {
  static async createMeeting(req, res) {
    try {
      const userId = req.user.userId;
      const { title, description, location, meetingDate, startTime, endTime, attendees, meetingLink } = req.body;
      if (!title || !meetingDate || !startTime || !endTime) {
        return res.status(400).json({ message: 'Title, date, and times are required' });
      }
      const meetingId = await Meeting.create(userId, {
        title,
        description: description || '',
        location: location || '',
        meetingDate,
        startTime,
        endTime,
        attendees: attendees || '',
        meetingLink: meetingLink || ''
      });
      res.status(201).json({
        message: 'Meeting created successfully',
        meetingId
      });
    } catch (error) {
      console.error('Create meeting error:', error);
      res.status(500).json({ message: 'Failed to create meeting' });
    }
  }
  static async getMeetings(req, res) {
    try {
      const userId = req.user.userId;

      const meetings = await Meeting.getUserMeetings(userId);

      res.status(200).json({ meetings });
    } catch (error) {
      console.error('Get meetings error:', error);
      res.status(500).json({ message: 'Failed to fetch meetings' });
    }
  }

  static async getMeetingById(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const meeting = await Meeting.getById(id, userId);

      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      res.status(200).json({ meeting });
    } catch (error) {
      console.error('Get meeting error:', error);
      res.status(500).json({ message: 'Failed to fetch meeting' });
    }
  }

  static async updateMeeting(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { title, description, location, meetingDate, startTime, endTime, attendees, meetingLink } = req.body;

      if (!title || !meetingDate || !startTime || !endTime) {
        return res.status(400).json({ message: 'Title, date, and times are required' });
      }

      const updated = await Meeting.update(id, userId, {
        title,
        description: description || '',
        location: location || '',
        meetingDate,
        startTime,
        endTime,
        attendees: attendees || '',
        meetingLink: meetingLink || ''
      });

      if (!updated) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      res.status(200).json({ message: 'Meeting updated successfully' });
    } catch (error) {
      console.error('Update meeting error:', error);
      res.status(500).json({ message: 'Failed to update meeting' });
    }
  }
  static async deleteMeeting(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const deleted = await Meeting.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
      console.error('Delete meeting error:', error);
      res.status(500).json({ message: 'Failed to delete meeting' });
    }
  }

  static async getMeetingsByDate(req, res) {
    try {
      const userId = req.user.userId;
      const { date } = req.params;

      const meetings = await Meeting.getMeetingsByDate(userId, date);

      res.status(200).json({ meetings });
    } catch (error) {
      console.error('Get meetings by date error:', error);
      res.status(500).json({ message: 'Failed to fetch meetings' });
    }
  }
  static async getUpcomingMeetings(req, res) {
    try {
      const userId = req.user.userId;
      const { days = 7 } = req.query;

      const meetings = await Meeting.getUpcomingMeetings(userId, days);

      res.status(200).json({ meetings });
    } catch (error) {
      console.error('Get upcoming meetings error:', error);
      res.status(500).json({ message: 'Failed to fetch meetings' });
    }
  }
}

export default MeetingController;