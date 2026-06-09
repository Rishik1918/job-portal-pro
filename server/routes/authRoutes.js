import express from 'express';
import { registerUser, loginUser, getProfile, forgotPassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRegistration } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/profile', verifyToken, getProfile);

export default router;
