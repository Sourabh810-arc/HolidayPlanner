import mongoose from 'mongoose';

const touristPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      enum: ['Mumbai', 'Delhi', 'Bangalore', 'Goa'],
    },
    type: {
      type: String,
      required: true,
      enum: ['Monument', 'Scenic', 'Historical', 'Beach', 'Religious', 'Park', 'Nature'],
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    openingHours: {
      type: String,
      default: '9:00 AM - 6:00 PM',
    },
    bestTimeToVisit: {
      type: String,
      default: '',
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    visitDuration: {
      type: String,
      default: '2-3 hours',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);
