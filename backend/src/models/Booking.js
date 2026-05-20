import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: false,
      default: null,
    },
    hotelName: String,
    hotelPrice: Number,
    city: String,
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    nights: Number,
    hotelCost: Number,
    activities: [
      {
        activityId: mongoose.Schema.Types.ObjectId,
        activityName: String,
        pricePerPerson: Number,
        totalParticipants: Number,
        totalCost: Number,
      },
    ],
    touristPlaces: [
      {
        placeId: mongoose.Schema.Types.ObjectId,
        placeName: String,
      },
    ],
    cabDetails: {
      cabType: String,
      bookingType: String, // perDay or fullTrip
      estimatedCost: Number,
      pickupLocation: String,
      dropLocation: String,
      pickupTime: String,
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
    },
    totalBudget: Number,
    totalSpent: Number,
    remainingBudget: Number,
    itinerary: [
      {
        day: Number,
        date: String,
        activities: [String],
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    guestEmail: String,
    guestPhone: String,
    guestName: String,
    specialRequests: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
