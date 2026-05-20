import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.put('/preferences', verifyToken, updateUserPreferences);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

export default router;
