import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    stars: {
      type: Number,
      required: true,
      enum: [2, 3, 4, 5],
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    amenities: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      default: 1,
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model('Hotel', hotelSchema);
