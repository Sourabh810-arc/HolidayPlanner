import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Import routes
import hotelRoutes from './routes/hotelRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import touristPlaceRoutes from './routes/touristPlaceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(origin => origin.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/tourist-places', touristPlaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on ${process.env.NODE_ENV} mode`);
  console.log(`📍 Listening on http://localhost:${PORT}`);
  console.log(`✅ API Health Check: http://localhost:${PORT}/api/health\n`);
});

export default app;
