import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Create nodemailer transporter (update with your SMTP credentials)
const smtpUser = process.env.SMTP_MAIL?.trim();
const smtpPass = process.env.SMTP_PASSWORD?.trim();
const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = Number(process.env.SMTP_PORT) || 587;

console.log('Auth Controller - SMTP Config:');
console.log('  Host:', smtpHost);
console.log('  Port:', smtpPort);
console.log('  User:', smtpUser);
console.log('  Password exists:', !!smtpPass);
console.log('  Password length:', smtpPass?.length);
console.log('  Raw password:', JSON.stringify(process.env.SMTP_PASSWORD));

if (!smtpUser || !smtpPass) {
  console.error('ERROR: SMTP credentials are missing!');
  console.error('  SMTP_MAIL:', JSON.stringify(process.env.SMTP_MAIL));
  console.error('  SMTP_PASSWORD:', JSON.stringify(process.env.SMTP_PASSWORD));
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      const fallbackName = email.split('@')[0] || 'Guest';
      user = await User.create({
        firstName: fallbackName,
        lastName: 'User',
        email,
        password: Math.random().toString(36).slice(2, 10) + 'A1!',
      });
    }

    if (password) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const fallbackName = email.split('@')[0] || 'Guest';
      user = await User.create({
        firstName: fallbackName,
        lastName: 'User',
        email,
        password: Math.random().toString(36).slice(2, 10) + 'A1!',
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'Your OTP for Holiday Planner Login',
      text: `Your OTP code is: ${otpCode}. It expires in 10 minutes.`,
      html: `<p>Your OTP code is: <strong>${otpCode}</strong></p><p>It expires in 10 minutes.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}: ${otpCode}`);
    } catch (mailError) {
      console.error('❌ OTP Email sending error:', mailError.message);
      console.error('   Full error:', mailError);
      console.error('   Error code:', mailError.code);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email',
        error: mailError.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+otpCode +otpExpires');
    if (!user || user.otpCode !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(401).json({ success: false, message: 'OTP has expired' });
    }

    user.otpCode = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const verifyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const testSmtp = async (req, res) => {
  try {
    // Log environment variables for debugging
    console.log('SMTP Config:');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_MAIL);
    console.log('Pass length:', process.env.SMTP_PASSWORD?.length);
    console.log('Pass exists:', !!process.env.SMTP_PASSWORD);
    
    // Verify transporter configuration
    await transporter.verify();
    res.status(200).json({
      success: true,
      message: 'SMTP connection verified successfully',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_MAIL,
      },
    });
  } catch (error) {
    console.error('SMTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'SMTP connection failed',
      error: error.message,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_MAIL,
      },
      solution: 'For Gmail: Use App Password (not regular password). Enable 2FA first, then generate app password at https://myaccount.google.com/apppasswords'
    });
  }
};
