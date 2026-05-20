import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  register,
  login,
  logout,
  verifyToken as verifyAuthToken,
  testSmtp,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyToken, verifyAuthToken);
router.get('/test-smtp', testSmtp);

export default router;
