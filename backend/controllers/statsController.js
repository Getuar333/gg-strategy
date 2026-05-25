import ProductivityStats from '../models/ProductivityStats.js';

export class StatsController {
  static async getTodayStats(req, res) {
    try {
      const userId = req.user.userId;
      const stats = await ProductivityStats.getTodayStats(userId);
      const calculated = await ProductivityStats.calculateStats(userId);
      res.status(200).json({ stats: calculated });
    } catch (error) {
      console.error('Get today stats error:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  }
  static async getStatsRange(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      const stats = await ProductivityStats.getStatsRange(userId, startDate, endDate);
      res.status(200).json({ stats });
    } catch (error) {
      console.error('Get stats range error:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  }
  static async calculateStatsForDate(req, res) {
    try {
      const userId = req.user.userId;
      const stats = await ProductivityStats.calculateStats(userId);
      res.status(200).json({ message: 'Stats calculated', stats });
    } catch (error) {
      console.error('Calculate stats error:', error);
      res.status(500).json({ message: 'Failed to calculate stats' });
    }
  }
}

export default StatsController;