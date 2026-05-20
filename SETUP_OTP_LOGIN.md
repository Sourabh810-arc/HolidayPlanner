# Email OTP Login Setup - Testing Guide

## ✅ Setup Complete

Your email-based OTP login system has been successfully configured with the following components:

### Backend Changes
1. ✅ **Email Controller** (`src/controllers/emailControllers.js`) - Handles email sending
2. ✅ **Email Routes** (`src/routes/emailRoutes.js`) - Email endpoints
3. ✅ **Auth Controller** - Updated with OTP request/verification logic
4. ✅ **Environment Variables** - SMTP configuration in `.env`
5. ✅ **Server** - Email routes registered and integrated

### Frontend Components
1. ✅ **LoginScreen** (`src/Screen/LoginScreen.jsx`) - Already configured to use OTP
2. ✅ **SmartHolidayPlanner** - Auth state management integrated

---

## 🚀 How to Test

### Prerequisites
- MongoDB running locally on `mongodb://localhost:27017/holidayplanner`
- Backend and frontend both running

### Step 1: Start the Backend
```bash
cd backend
npm install  # if not already done
npm run dev  # Start with nodemon for development
```

Expected output:
```
🚀 Server running on development mode
📍 Listening on http://localhost:5000
✅ API Health Check: http://localhost:5000/api/health
```

### Step 2: Start the Frontend
```bash
cd my-react-app
npm run dev
```

Open browser: `http://localhost:5173`

### Step 3: Test OTP Login Flow

1. **On the LoginScreen:**
   - Enter your email (e.g., `test@gmail.com`)
   - Click "Send OTP"
   
2. **In Development Mode:**
   - The OTP will be displayed on screen as "Demo OTP"
   - You'll also see it in the backend console
   - An email will be sent to your address (if SMTP is properly configured)

3. **Verify OTP:**
   - Copy the demo OTP or check your email
   - Paste it into the "Enter OTP" field
   - Click "Verify OTP"
   - On success, you'll be logged in and redirected to the holiday planner form

---

## ⚙️ Configuration

### Email Credentials (in `.env`)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_MAIL=munish45698@gmail.com
SMTP_PASSWORD=khhhhi
```

**For Gmail:**
- Use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password)
- Enable "Less secure app access" if using regular password
- You may need to enable 2FA first

### OTP Settings (in Backend)
- **Expiry:** 10 minutes
- **Format:** 6-digit random code
- **Development Mode:** OTP shown in frontend for testing
- **Production Mode:** OTP hidden (only sent via email)

---

## 🔄 API Endpoints

### Request OTP
```
POST http://localhost:5000/api/auth/request-otp
Content-Type: application/json

{
  "email": "test@gmail.com"
}

Response (Development):
{
  "success": true,
  "message": "OTP sent to your email",
  "otpCode": "123456"  // Only in development
}
```

### Verify OTP
```
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@gmail.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "test",
    "lastName": "User",
    "email": "test@gmail.com",
    "phone": ""
  }
}
```

### Send Email (Optional - For Testing)
```
POST http://localhost:5000/api/email/sendEmail
Content-Type: application/json

{
  "email": "recipient@gmail.com",
  "subject": "Test Email",
  "message": "This is a test email"
}
```

---

## 🛠️ Troubleshooting

### Email Not Sending
1. **Check SMTP Credentials:**
   - Verify email and password in `.env`
   - For Gmail: Use [App Password](https://myaccount.google.com/apppasswords), not your regular password

2. **Check Backend Console:**
   ```bash
   # Look for email sending errors
   npm run dev  # Check console output
   ```

3. **Verify Email Configuration:**
   ```bash
   # Test SMTP connection
   npm run test:smtp
   ```

### OTP Not Working
1. **Check MongoDB:**
   - Ensure MongoDB is running
   - User data should be saved with otpCode and otpExpires

2. **Check Time Sync:**
   - OTP expires after 10 minutes
   - Ensure your system time is correct

3. **Check Development Mode:**
   - In production, OTP won't be displayed on frontend
   - Use `.env` `NODE_ENV=development` for testing

### Frontend Not Connecting to Backend
1. **Check Backend URL:**
   - Frontend expects: `http://localhost:5000`
   - Ensure CORS_ORIGIN includes frontend URL in `.env`

2. **Check CORS Settings:**
   ```env
   CORS_ORIGIN=http://localhost:5173,http://localhost:5174
   ```

---

## 📊 User Model Fields

The User model now includes:
- `otpCode` - 6-digit OTP (hidden by default)
- `otpExpires` - Timestamp when OTP expires
- Standard fields: firstName, lastName, email, password, phone

---

## 🔐 Security Notes

1. **Development vs Production:**
   - Development: OTP shown on frontend for testing
   - Production: OTP only sent via email

2. **OTP Expiry:** 10 minutes (configurable)

3. **Rate Limiting:** Consider adding in production to prevent brute force

4. **HTTPS:** Use HTTPS in production for email credentials

---

## ✨ Features Implemented

✅ Email-based OTP login
✅ Automatic user creation on first login
✅ 10-minute OTP expiry
✅ Development mode with visible OTP
✅ Production mode with hidden OTP
✅ Email sending via Nodemailer
✅ User authentication with JWT tokens
✅ Proper error handling
✅ MongoDB integration
✅ Frontend LoginScreen fully integrated

---

## 📚 File References

- Backend Auth Controller: `backend/src/controllers/authController.js`
- Email Controller: `backend/src/controllers/emailControllers.js`
- Email Routes: `backend/src/routes/emailRoutes.js`
- User Model: `backend/src/models/User.js`
- Frontend LoginScreen: `my-react-app/src/Screen/LoginScreen.jsx`
- Environment Config: `backend/.env`

