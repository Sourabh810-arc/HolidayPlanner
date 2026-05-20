import { Hotel } from '../models/Hotel.js';

export const getAllHotels = async (req, res, next) => {
  try {
    const { city, stars, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = city;
    if (stars) filter.stars = parseInt(stars);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const hotels = await Hotel.find(filter).sort({ price: 1 });
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelsByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const hotels = await Hotel.find({ city, isActive: true }).sort({ stars: -1, price: 1 });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
