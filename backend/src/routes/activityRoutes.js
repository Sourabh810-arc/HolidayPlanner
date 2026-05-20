import express from 'express';
import {
  getAllActivities,
  getActivityById,
  getActivitiesByCity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/', getAllActivities);
router.get('/city/:city', getActivitiesByCity);
router.get('/:id', getActivityById);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
