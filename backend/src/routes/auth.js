import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authRateLimit } from '../middleware/auth.js';

const router = express.Router();

/**
 * Authentication Routes
 * All routes have rate limiting applied
 */

// Apply rate limiting to all auth routes
router.use(authRateLimit(5, 15)); // 5 attempts per 15 minutes

/**
 * @route POST /api/v1/auth/login
 * @desc User login
 * @access Public
 */
router.post('/login', AuthController.login);

/**
 * @route POST /api/v1/auth/logout
 * @desc User logout (invalidate tokens)
 * @access Private
 */
router.post('/logout', AuthController.logout);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token using refresh token
 * @access Public (requires valid refresh token)
 */
router.post('/refresh', AuthController.refresh);

/**
 * @route POST /api/v1/auth/switch-clinic
 * @desc Switch user's current clinic context
 * @access Private
 */
router.post('/switch-clinic', AuthController.switchClinic);

/**
 * @route GET /api/v1/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', AuthController.getProfile);

export default router;