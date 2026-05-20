import { Activity } from '../models/Activity.js';

export const getAllActivities = async (req, res, next) => {
  try {
    const { city, tag, difficulty } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = city;
    if (tag) filter.tag = tag;
    if (difficulty) filter.difficulty = difficulty;

    const activities = await Activity.find(filter).sort({ pricePerPerson: 1 });
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivitiesByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const activities = await Activity.find({ city, isActive: true }).sort({ tag: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
