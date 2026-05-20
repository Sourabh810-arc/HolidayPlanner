import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
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
    emoji: {
      type: String,
      default: '🎯',
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
    },
    tag: {
      type: String,
      required: true,
      enum: ['Extreme', 'Water', 'Adventure', 'Sport', 'Nature'],
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '1-2 hours',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    maxParticipants: {
      type: Number,
      default: 100,
    },
    image: {
      type: String,
      default: null,
    },
    provider: {
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

export const Activity = mongoose.model('Activity', activitySchema);
