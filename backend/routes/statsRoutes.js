import express from 'express';
import StatsController from '../controllers/statsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/today', StatsController.getTodayStats);
router.get('/range', StatsController.getStatsRange);
router.post('/calculate', StatsController.calculateStatsForDate);

export default router;
