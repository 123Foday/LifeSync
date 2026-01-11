import rateLimit from 'express-rate-limit';

// Global rate limiter for ALL auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Stricter limiter for OTP generation and verification
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: {
    success: false,
    message: 'Too many OTP attempts, please try again after 10 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for login attempts to prevent brute force
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Limit each IP to 10 login attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
