# Holiday Planner Backend API

A robust Express.js backend for the Smart Holiday Planner application with MongoDB database, JWT authentication, and comprehensive REST API endpoints.

## ✅ Status: FULLY WORKING & RUNNING

**Backend Server:** http://localhost:5000
**Database:** MongoDB (Connected & Seeded)
**Environment:** Development

---

## Features

✨ **Core Features:**
- ✅ User authentication (Register, Login, JWT tokens)
- ✅ Hotel management with city and star rating filters
- ✅ Activity management with difficulty and category filters
- ✅ Tourist place management
- ✅ Booking management with full trip details
- ✅ User profile management with preferences
- ✅ Error handling and validation
- ✅ CORS support for cross-origin requests (http://localhost:5173)

## Technologies Used

- **Framework:** Express.js ^4.18.2
- **Database:** MongoDB with Mongoose ^7.0.0
- **Authentication:** JWT (jsonwebtoken ^9.0.0)
- **Security:** Helmet.js ^7.0.0, bcryptjs ^2.4.3
- **Environment:** dotenv ^16.0.3
- **Validation:** Joi ^17.9.2
- **File Upload:** Multer ^1.4.5-lts.1
- **Tool:** Nodemon ^2.0.22 (development)

## Project Structure

```
backend/
├── src/
│   ├── config/              # Database configuration
│   │   └── database.js      ✅ MongoDB connection setup
│   ├── controllers/         # Business logic
│   │   ├── authController.js       ✅ Auth logic
│   │   ├── hotelController.js      ✅ Hotel operations
│   │   ├── activityController.js   ✅ Activity operations
│   │   ├── touristPlaceController.js ✅ Tourist place operations
│   │   ├── bookingController.js    ✅ Booking management
│   │   └── userController.js       ✅ User profile management
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js       ✅ JWT verification
│   │   ├── errorHandler.js         ✅ Error handling
│   │   └── notFoundHandler.js      ✅ 404 handling
│   ├── models/              # Mongoose schemas
│   │   ├── User.js          ✅ User model with password hashing
│   │   ├── Hotel.js         ✅ Hotel model (16 samples)
│   │   ├── Activity.js      ✅ Activity model (10 samples)
│   │   ├── TouristPlace.js  ✅ Tourist place model (8 samples)
│   │   └── Booking.js       ✅ Booking model
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js    ✅ Auth endpoints
│   │   ├── hotelRoutes.js   ✅ Hotel endpoints
│   │   ├── activityRoutes.js ✅ Activity endpoints
│   │   ├── touristPlaceRoutes.js ✅ Tourist place endpoints
│   │   ├── bookingRoutes.js ✅ Booking endpoints
│   │   └── userRoutes.js    ✅ User endpoints
│   ├── scripts/
│   │   └── seedDatabase.js  ✅ Database seeding (contains 34 sample records)
│   └── server.js            ✅ Main server file
├── .env                     ✅ Configuration (created with defaults)
├── .env.example             ✅ Environment template
├── package.json             ✅ Dependencies (all installed)
├── package-lock.json        ✅ Lock file
└── README.md               ✅ This file
```

---

## Installation & Setup

### ✅ What's Already Done

1. **Dependencies Installed** - All npm packages ready
2. **.env File Created** - Configured for local development
3. **MongoDB Connected** - Running and connected
4. **Database Seeded** - 16 hotels, 10 activities, 8 tourist places loaded
5. **Server Running** - Listening on port 5000

### 👉 To Start Fresh

#### 1. Start MongoDB (if not running)
```bash
# Windows Services
net start MongoDB

# Or check process
Get-Process mongod
```

#### 2. Start Backend Server
```bash
cd backend
node src/server.js
```

**Expected output:**
```
🚀 Server running on development mode
📍 Listening on http://localhost:5000
✅ API Health Check: http://localhost:5000/api/health
✅ MongoDB Connected: localhost
```

---

## API Endpoints

### 🏥 Health Check
- `GET /api/health` - Server status & timestamp

### 🏨 Hotels
- `GET /api/hotels` - Get all hotels (supports filters: city, stars, minPrice, maxPrice)
- `GET /api/hotels/:id` - Get specific hotel
- `GET /api/hotels/city/:city` - Get hotels by city (Mumbai, Delhi, Bangalore, Goa)
- `POST /api/hotels` - Create new hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

**Sample Response:**
```json
{
  "success": true,
  "count": 16,
  "data": [
    {
      "_id": "...",
      "name": "Budget Inn Mumbai",
      "city": "Mumbai",
      "price": 2000,
      "stars": 2,
      "rating": 3.5,
      "location": "Andheri"
    }
  ]
}
```

### 🎯 Activities
- `GET /api/activities` - Get all activities (supports filters: city, tag, difficulty)
- `GET /api/activities/:id` - Get specific activity
- `GET /api/activities/city/:city` - Get activities by city
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

**Activity Tags:** Extreme, Water, Adventure, Sport, Nature

### 🗺️ Tourist Places
- `GET /api/tourist-places` - Get all tourist places (supports filters: city, type)
- `GET /api/tourist-places/:id` - Get specific place
- `GET /api/tourist-places/city/:city` - Get places by city
- `POST /api/tourist-places` - Create place
- `PUT /api/tourist-places/:id` - Update place
- `DELETE /api/tourist-places/:id` - Delete place

**Place Types:** Monument, Scenic, Historical, Beach, Religious, Park, Nature

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210"
  }
  ```
- `POST /api/auth/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token (requires Authorization header)

### 👤 User Profile
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update profile (firstName, lastName, phone, profileImage)
- `PUT /api/users/preferences` - Update user preferences

### 📅 Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user/:userId` - Get user's bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

---

## Environment Configuration

### .env File
```env
PORT=5000                                          # Server port
NODE_ENV=development                               # Environment
MONGODB_URI=mongodb://localhost:27017/holiday-planner  # MongoDB connection
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345  # JWT secret key
JWT_EXPIRE=7d                                      # Token expiration
CORS_ORIGIN=http://localhost:5173                 # Frontend URL for CORS
```

Notes:
- `CORS_ORIGIN` can contain multiple origins separated by commas, for example:
  `CORS_ORIGIN=https://capable-toffee-60eb54.netlify.app,https://your-other-domain.com`
- Use `CORS_ORIGIN=*` only for testing; it's not recommended for production.

---

## Database Schema

### Users Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  phone: String,
  profileImage: String,
  bookings: [ObjectId],
  preferences: {
    favoriteDestinations: [String],
    budgetRange: { min: Number, max: Number },
    preferredHotelStars: Number
  },
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Hotels Collection
```javascript
{
  name: String,
  city: String (enum: Mumbai, Delhi, Bangalore, Goa),
  price: Number,
  rating: Number (0-5),
  stars: Number (enum: 2, 3, 4, 5),
  location: String,
  image: String,
  description: String,
  amenities: [String],
  capacity: Number,
  isActive: Boolean
}
```

### Activities Collection
```javascript
{
  name: String,
  city: String,
  emoji: String,
  pricePerPerson: Number,
  tag: String (enum: Extreme, Water, Adventure, Sport, Nature),
  description: String,
  duration: String,
  difficulty: String,
  maxParticipants: Number,
  image: String
}
```

### Tourist Places Collection
```javascript
{
  name: String,
  city: String,
  type: String (enum: Monument, Scenic, Historical, Beach, Religious, Park, Nature),
  image: String,
  description: String,
  entryFee: Number,
  openingHours: String,
  rating: Number (0-5),
  visitDuration: String
}
```

### Bookings Collection
```javascript
{
  userId: ObjectId (optional),
  hotelId: ObjectId,
  hotelName: String,
  hotelPrice: Number,
  city: String,
  checkIn: Date,
  checkOut: Date,
  nights: Number,
  hotelCost: Number,
  activities: [{
    activityId: ObjectId,
    activityName: String,
    pricePerPerson: Number,
    totalParticipants: Number,
    totalCost: Number
  }],
  touristPlaces: [{
    placeId: ObjectId,
    placeName: String
  }],
  cabDetails: Object,
  travelers: Number,
  totalBudget: Number,
  totalSpent: Number,
  guestEmail: String,
  guestPhone: String,
  guestName: String,
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Sample Data

### Hotels (16 total - 4 per city)
- Mumbai: Budget Inn, Comfort Stay, City Plaza, Grand Resort
- Delhi: Budget Lodge, Capital Inn, Heritage Hotel, Luxury Palace
- Bangalore: Tech City Lodge, Garden View, Silicon Valley, Premium Stay
- Goa: Beach Budget Hut, Coastal Comfort, Ocean View, Luxury Beach Villa

### Activities (10 total)
- Paragliding (Mumbai & Delhi), Surfing (Mumbai & Goa), Jet Skiing
- White-water Rafting, Scuba Diving, Skydiving, Dolphin Watching, Archery

### Tourist Places (8 total)
- Mumbai: Gateway of India, Marine Drive
- Delhi: India Gate, Red Fort
- Bangalore: Lalbagh Gardens, Bangalore Palace
- Goa: Baga Beach, Basilica of Bom Jesus

---

## Testing

### Test with curl
```bash
# Health check
curl http://localhost:5000/api/health

# Get all hotels
curl http://localhost:5000/api/hotels

# Get hotels in Mumbai
curl "http://localhost:5000/api/hotels/city/Mumbai"

# Get activities
curl http://localhost:5000/api/activities

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

### Test with Postman
1. Import the backend API collection
2. Set base URL to `http://localhost:5000/api/`
3. Test all endpoints

---

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## Running Scripts

### Seed Database
```bash
cd backend
node src/scripts/seedDatabase.js
```

This will:
- Clear existing data
- Insert 16 hotels
- Insert 10 activities
- Insert 8 tourist places

✅ **Status:** Database already seeded with 34 sample records

---

## Development

### Start with Auto-Reload
```bash
cd backend
npm run dev
# Uses nodemon for auto-restart on file changes
```

### Environment Variables
All configuration is in `.env` file - edit as needed

### Logging
- Console logs for server startup
- Error logs for debugging
- MongoDB connection status

---

## Troubleshooting

### Issue: MongoDB Connection Error
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify MongoDB listens on port 27017

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change `PORT` in `.env`
- Kill process using port: `Get-Process -Id $(netstat -ano | Select-String :5000 | ForEach-Object {$_ -split '\s+' | Select-Object -Last 1})`

### Issue: JWT Token Expired
**Solution:**
- Login again to get new token
- Increase JWT_EXPIRE in `.env` if needed

### Issue: CORS Errors in Frontend
**Solution:**
- Verify CORS_ORIGIN in `.env` matches frontend URL
- Ensure frontend sends requests to correct base URL

---

## API Documentation

For detailed API testing examples, see: [API_TESTING.md](./API_TESTING.md)

---

## Next Steps

1. ✅ Backend fully operational
2. ✅ Database seeded with sample data
3. ✅ All endpoints tested
4. 👉 Frontend integration in progress
5. 👉 Add admin dashboard
6. 👉 Deploy to production

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review error messages in server logs
3. Check MongoDB connection
4. Verify environment variables

---

**Last Updated:** May 8, 2026
**Status:** ✅ FULLY WORKING & RUNNING
- npm or yarn

### Setup Steps

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/holiday-planner
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Seed the database (optional):**
   ```bash
   node src/scripts/seedDatabase.js
   ```

6. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /verify` - Verify JWT token (requires auth)

### Hotels (`/api/hotels`)
- `GET /` - Get all hotels with filters (city, stars, price)
- `GET /city/:city` - Get hotels by city
- `GET /:id` - Get hotel by ID
- `POST /` - Create new hotel
- `PUT /:id` - Update hotel
- `DELETE /:id` - Delete hotel

### Activities (`/api/activities`)
- `GET /` - Get all activities with filters (city, tag, difficulty)
- `GET /city/:city` - Get activities by city
- `GET /:id` - Get activity by ID
- `POST /` - Create new activity
- `PUT /:id` - Update activity
- `DELETE /:id` - Delete activity

### Tourist Places (`/api/tourist-places`)
- `GET /` - Get all tourist places with filters (city, type)
- `GET /city/:city` - Get places by city
- `GET /:id` - Get place by ID
- `POST /` - Create new place
- `PUT /:id` - Update place
- `DELETE /:id` - Delete place

### Bookings (`/api/bookings`)
- `POST /` - Create new booking
- `GET /` - Get all bookings with filters
- `GET /:id` - Get booking by ID
- `GET /user/my-bookings` - Get user's bookings (requires auth)
- `GET /stats` - Get booking statistics
- `PUT /:id` - Update booking
- `PATCH /:id/cancel` - Cancel booking

### Users (`/api/users`)
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update profile (requires auth)
- `PUT /preferences` - Update preferences (requires auth)
- `GET /` - Get all users
- `DELETE /:id` - Delete user

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "9876543210"
}
```

### Create Booking
```bash
POST /api/bookings
Content-Type: application/json
Authorization: Bearer {token}

{
  "hotelId": "60d5ec49c5f41c0012345678",
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-05",
  "travelers": 2,
  "totalBudget": 50000,
  "totalSpent": 45000,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "activities": [],
  "touristPlaces": []
}
```

## Database Models

### User
- firstName, lastName
- email (unique)
- password (hashed)
- phone
- bookings (references)
- preferences (favoriteDestinations, budgetRange, hotelStars)

### Hotel
- name, city, price, rating, stars
- location, image
- description, amenities, capacity
- contactEmail, contactPhone
- isActive

### Activity
- name, city, emoji
- pricePerPerson, tag (Extreme, Water, Adventure, Sport, Nature)
- description, duration, difficulty
- maxParticipants, image
- provider, isActive

### TouristPlace
- name, city, type
- image, description
- entryFee, openingHours, bestTimeToVisit
- coordinates (latitude, longitude)
- rating, visitDuration

### Booking
- hotelId, hotelName, hotelPrice, hotelCost
- checkIn, checkOut, nights
- activities, touristPlaces
- cabDetails (type, bookingType, estimatedCost)
- travelers, totalBudget, totalSpent
- itinerary (day-by-day activities)
- status (pending, confirmed, completed, cancelled)
- guestEmail, guestPhone, guestName
- paymentStatus (pending, completed, failed)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server returns a JWT token
3. Include token in Authorization header for protected routes:
   ```
   Authorization: Bearer {token}
   ```

Tokens expire in 7 days (configurable via JWT_EXPIRE).

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/holiday-planner |
| JWT_SECRET | JWT signing secret | N/A (Required) |
| JWT_EXPIRE | Token expiry duration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Development

### Run in Development Mode
```bash
npm run dev
```

### Run in Production Mode
```bash
npm start
```

### Seed Database
```bash
node src/scripts/seedDatabase.js
```

## Frontend Integration

To connect the frontend React app:

1. Update frontend API base URL to `http://localhost:5000/api`
2. Ensure CORS_ORIGIN in backend `.env` matches frontend URL
3. Add authentication token to requests:
   ```javascript
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   };
   ```

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
