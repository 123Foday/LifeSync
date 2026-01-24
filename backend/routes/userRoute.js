import express from 'express'
import { registerUser, verifyEmail, verifyOTP, resendOTP, forgotPassword, resetPassword, requestEmailChange, verifyOldEmailAndSendNewOTP, finalizeEmailChange, googleLoginController, appleLoginController, microsoftLoginController, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, deleteAccount, requestDeletionOTP } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import { authLimiter, otpLimiter, loginLimiter } from '../middlewares/rateLimiter.js'


const userRouter = express.Router()

// Applied authLimiter to all user routes
userRouter.use(authLimiter)

// Public Registration & Verification
userRouter.post('/register', registerUser)
userRouter.get('/verify-email', verifyEmail)
userRouter.post('/verify-otp', otpLimiter, verifyOTP)
userRouter.post('/resend-otp', otpLimiter, resendOTP)

// Public Login
userRouter.post('/login', loginLimiter, loginUser)
userRouter.post("/google-login", googleLoginController);
userRouter.post("/apple-login", appleLoginController);
userRouter.post("/microsoft-login", microsoftLoginController);

// Public Password Reset
userRouter.post('/forgot-password', otpLimiter, forgotPassword)
userRouter.post('/reset-password', resetPassword)


// Protected routes (require authUser middleware)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/delete-account', authUser, deleteAccount)
userRouter.post('/request-deletion-otp', authUser, requestDeletionOTP)

// Email Change Flow (Protected)
userRouter.post('/request-email-change', authUser, otpLimiter, requestEmailChange)
userRouter.post('/verify-old-email', authUser, otpLimiter, verifyOldEmailAndSendNewOTP)
userRouter.post('/finalize-email-change', authUser, otpLimiter, finalizeEmailChange)


export default userRouter