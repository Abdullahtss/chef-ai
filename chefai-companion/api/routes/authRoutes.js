import express from 'express';
import { register, login, googleAuth, getProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Protected routes
router.get('/profile', auth, getProfile);

export default router;
