import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Hotel } from '../models/Hotel.js';
import { Activity } from '../models/Activity.js';
import { TouristPlace } from '../models/TouristPlace.js';

export const createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      hotelName,
      hotelPrice,
      city,
      checkIn,
      checkOut,
      activities,
      touristPlaces,
      cabDetails,
      travelers,
      totalBudget,
      totalSpent,
      guestEmail,
      guestPhone,
      guestName,
      itinerary,
      specialRequests,
    } = req.body;

    let hotel = null;
    let resolvedHotelId = null;
    let resolvedHotelName = hotelName;
    let resolvedHotelPrice = hotelPrice;
    let resolvedCity = city;

    if (hotelId && mongoose.isValidObjectId(hotelId)) {
      hotel = await Hotel.findById(hotelId);
      resolvedHotelId = hotel?._id || null;
    }

    if (hotel) {
      resolvedHotelName = hotel.name;
      resolvedHotelPrice = hotel.price;
      resolvedCity = hotel.city;
    }

    if (!resolvedHotelName || !resolvedHotelPrice || !resolvedCity) {
      return res.status(400).json({
        success: false,
        message: 'Hotel details are incomplete',
      });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    const booking = await Booking.create({
      hotelId: resolvedHotelId,
      hotelName: resolvedHotelName,
      hotelPrice: resolvedHotelPrice,
      city: resolvedCity,
      checkIn,
      checkOut,
      nights,
      hotelCost: resolvedHotelPrice * nights,
      activities: activities || [],
      touristPlaces: touristPlaces || [],
      cabDetails: cabDetails || null,
      travelers,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      guestEmail,
      guestPhone,
      guestName,
      itinerary: itinerary || [],
      specialRequests,
      userId: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotelId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const bookings = await Booking.find({ userId })
      .populate('hotelId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('hotelId')
      .populate('userId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalSpent' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
