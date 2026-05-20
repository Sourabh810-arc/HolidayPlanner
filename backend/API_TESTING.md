# API Testing Guide

This file contains curl commands to test all the API endpoints.

## Health Check

```bash
curl -X GET http://localhost:5000/api/health
```

## Authentication

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Verify Token
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Hotels

### Get All Hotels
```bash
curl -X GET "http://localhost:5000/api/hotels"
```

### Get Hotels by City
```bash
curl -X GET "http://localhost:5000/api/hotels/city/Mumbai"
```

### Get Hotels with Filters
```bash
curl -X GET "http://localhost:5000/api/hotels?city=Mumbai&stars=4&minPrice=4000&maxPrice=6000"
```

### Get Hotel by ID
```bash
curl -X GET "http://localhost:5000/api/hotels/{hotelId}"
```

### Create Hotel
```bash
curl -X POST http://localhost:5000/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Hotel",
    "city": "Mumbai",
    "price": 3500,
    "rating": 4.0,
    "stars": 3,
    "location": "Bandra",
    "image": "https://example.com/hotel.jpg",
    "description": "A great hotel",
    "amenities": ["WiFi", "Pool", "Gym"],
    "capacity": 4,
    "contactEmail": "hotel@example.com",
    "contactPhone": "9876543210"
  }'
```

## Activities

### Get All Activities
```bash
curl -X GET "http://localhost:5000/api/activities"
```

### Get Activities by City
```bash
curl -X GET "http://localhost:5000/api/activities/city/Goa"
```

### Get Activities with Filters
```bash
curl -X GET "http://localhost:5000/api/activities?city=Mumbai&tag=Water&difficulty=Beginner"
```

### Create Activity
```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rock Climbing",
    "city": "Mumbai",
    "emoji": "🧗",
    "pricePerPerson": 800,
    "tag": "Adventure",
    "description": "Learn rock climbing with expert guides",
    "duration": "3 hours",
    "difficulty": "Beginner",
    "maxParticipants": 20,
    "provider": "Adventure Sports Co."
  }'
```

## Tourist Places

### Get All Tourist Places
```bash
curl -X GET "http://localhost:5000/api/tourist-places"
```

### Get Places by City
```bash
curl -X GET "http://localhost:5000/api/tourist-places/city/Delhi"
```

### Get Places with Filters
```bash
curl -X GET "http://localhost:5000/api/tourist-places?city=Bangalore&type=Park"
```

### Create Tourist Place
```bash
curl -X POST http://localhost:5000/api/tourist-places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Museum",
    "city": "Bangalore",
    "type": "Park",
    "image": "https://example.com/place.jpg",
    "description": "A great museum",
    "entryFee": 100,
    "openingHours": "9:00 AM - 6:00 PM",
    "bestTimeToVisit": "Morning",
    "rating": 4.5,
    "visitDuration": "2 hours"
  }'
```

## Bookings

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "HOTEL_ID_HERE",
    "checkIn": "2024-06-01",
    "checkOut": "2024-06-05",
    "travelers": 2,
    "totalBudget": 50000,
    "totalSpent": 45000,
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "9876543210",
    "activities": [],
    "touristPlaces": [],
    "specialRequests": "Non-smoking room"
  }'
```

### Get All Bookings
```bash
curl -X GET "http://localhost:5000/api/bookings"
```

### Get Bookings by City
```bash
curl -X GET "http://localhost:5000/api/bookings?city=Mumbai&status=confirmed"
```

### Get User Bookings (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/bookings/user/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Booking Statistics
```bash
curl -X GET "http://localhost:5000/api/bookings/stats"
```

### Get Booking by ID
```bash
curl -X GET "http://localhost:5000/api/bookings/{bookingId}"
```

### Update Booking
```bash
curl -X PUT http://localhost:5000/api/bookings/{bookingId} \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "Jane Doe",
    "specialRequests": "Early check-in requested"
  }'
```

### Cancel Booking
```bash
curl -X PATCH "http://localhost:5000/api/bookings/{bookingId}/cancel"
```

## Users

### Get User Profile (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update User Profile (Requires Auth)
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "9876543211",
    "profileImage": "https://example.com/image.jpg"
  }'
```

### Update User Preferences (Requires Auth)
```bash
curl -X PUT http://localhost:5000/api/users/preferences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "favoriteDestinations": ["Mumbai", "Goa"],
    "budgetRange": {
      "min": 20000,
      "max": 100000
    },
    "preferredHotelStars": 4
  }'
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/users"
```

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login
- Replace `{hotelId}`, `{bookingId}`, etc. with actual IDs
- All POST/PUT requests require `Content-Type: application/json` header
- Protected endpoints require valid JWT token in Authorization header
- Token format: `Bearer {token}`
