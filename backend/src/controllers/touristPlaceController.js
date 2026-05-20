import { TouristPlace } from '../models/TouristPlace.js';

export const getAllTouristPlaces = async (req, res, next) => {
  try {
    const { city, type } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = city;
    if (type) filter.type = type;

    const places = await TouristPlace.find(filter).sort({ city: 1 });
    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

export const getTouristPlaceById = async (req, res, next) => {
  try {
    const place = await TouristPlace.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Tourist place not found',
      });
    }

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

export const getTouristPlacesByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const places = await TouristPlace.find({ city, isActive: true }).sort({ type: 1 });

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

export const createTouristPlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tourist place created successfully',
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTouristPlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Tourist place not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tourist place updated successfully',
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTouristPlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.findByIdAndDelete(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Tourist place not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tourist place deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
