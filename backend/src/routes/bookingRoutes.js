import express from 'express';
import { verifyToken, optionalAuth } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  getBookingStats,
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', optionalAuth, createBooking);
router.get('/stats', getBookingStats);
router.get('/user/my-bookings', verifyToken, getUserBookings);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
