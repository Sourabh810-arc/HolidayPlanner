import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  register,
  login,
  logout,
  requestOtp,
  verifyOtp,
  verifyToken as verifyAuthToken,
  testSmtp,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/verify', verifyToken, verifyAuthToken);
router.get('/test-smtp', testSmtp);

export default router;
