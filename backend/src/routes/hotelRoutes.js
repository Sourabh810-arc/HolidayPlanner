import express from 'express';
import {
  getAllHotels,
  getHotelById,
  getHotelsByCity,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';

const router = express.Router();

router.get('/', getAllHotels);
router.get('/city/:city', getHotelsByCity);
router.get('/:id', getHotelById);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

export default router;
