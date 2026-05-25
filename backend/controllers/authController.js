import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import { validateEmail, validatePassword, validateName } from '../utils/validators.js';

dotenv.config();

export class AuthController {
  static setRefreshTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static async register(req, res) {
    try {
      const { fullName, email, password, confirmPassword } = req.body;

      if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (!validateName(fullName)) {
        return res.status(400).json({ message: 'Full name must be 2-100 characters' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters, 1 uppercase letter, 1 number',
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const userId = await User.create(fullName, email, password);
      if (!userId) {
        return res.status(500).json({ message: 'Failed to create user' });
      }

      const token = generateToken(userId);
      const refreshToken = generateRefreshToken(userId);

      AuthController.setRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: userId,
          fullName,
          email,
        },
      });
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await User.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      AuthController.setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      return res.status(500).json({ message: 'Server error during login' });
    }
  }

  static async logout(_req, res) {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('LOGOUT ERROR:', error);
      return res.status(500).json({ message: 'Server error during logout' });
    }
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }

      try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(refreshToken, refreshSecret);
        const token = generateToken(decoded.userId);

        return res.status(200).json({
          token,
          message: 'Token refreshed successfully',
        });
      } catch (error) {
        res.clearCookie('refreshToken');
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
      console.error('REFRESH TOKEN ERROR:', error);
      return res.status(500).json({ message: 'Server error during token refresh' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      console.error('GET USER ERROR:', error);
      return res.status(500).json({ message: 'Failed to fetch user' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { fullName, email } = req.body;

      if (!fullName || !email) {
        return res.status(400).json({ message: 'Full name and email are required' });
      }

      if (!validateName(fullName)) {
        return res.status(400).json({ message: 'Full name must be 2-100 characters' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const updated = await User.update(userId, fullName, email);
      if (!updated) {
        return res.status(500).json({ message: 'Failed to update profile' });
      }

      const user = await User.findById(userId);

      return res.status(200).json({
        message: 'Profile updated',
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      return res.status(500).json({ message: 'Failed to update profile' });
    }
  }
}

export default AuthController;
