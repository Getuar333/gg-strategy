import express from 'express';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;