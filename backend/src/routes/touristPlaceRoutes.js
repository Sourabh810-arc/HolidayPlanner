import express from 'express';
import {
  getAllTouristPlaces,
  getTouristPlaceById,
  getTouristPlacesByCity,
  createTouristPlace,
  updateTouristPlace,
  deleteTouristPlace,
} from '../controllers/touristPlaceController.js';

const router = express.Router();

router.get('/', getAllTouristPlaces);
router.get('/city/:city', getTouristPlacesByCity);
router.get('/:id', getTouristPlaceById);
router.post('/', createTouristPlace);
router.put('/:id', updateTouristPlace);
router.delete('/:id', deleteTouristPlace);

export default router;
