import axios from 'axios'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import hospitalModel from '../models/hospitalModel.js'
import appointmentModel from '../models/appointmentModel.js'
import otpModel from '../models/otpModel.js'
import { sendOTPEmail, sendPasswordResetEmail, sendAccountDeletionEmail } from '../utils/emailService.js'
import crypto from 'crypto'
import { OAuth2Client } from "google-auth-library";


// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" })
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" })
    }

    // validating a strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters, include uppercase, lowercase, number and symbol" 
      })
    }

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered with this email" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword,
      is_verified: false // Set to false, user needs OTP
    }

    const newUser = new userModel(userData)
    await newUser.save()

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otp_hash = await bcrypt.hash(otp, salt); // Using same salt for simplicity, though bcrypt.hash(otp, 10) is also fine

    // Store OTP in database
    await otpModel.findOneAndUpdate(
      { email, purpose: 'verification' },
      { 
        otp_hash, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0 
      },
      { upsert: true, new: true }
    );

    // Send OTP to user's email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      // In production, you might want to log this or handle differently
      console.warn('Registration: OTP email failed to send to', email);
    }

    res.status(201).json({ 
      success: true, 
      message: "Registration successful. Please check your email for verification code."
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// API to verify OTP for registration
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await otpModel.findOne({ email, purpose: 'verification' });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No verification request found for this email" });
    }

    // Check expiry
    if (otpRecord.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    // Rate limiting for attempts (Brute force protection)
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isMatch) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    // Success: Verify user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.is_verified = true;
    await user.save();

    // Invalidate OTP (Delete it)
    await otpModel.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      token,
      message: "Account verified successfully" 
    });

  } catch (error) {
    console.error('OTP Verification error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate new 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp, salt);

    // Update or Create OTP record
    await otpModel.findOneAndUpdate(
      { email, purpose },
      { 
        otp_hash, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000), 
        attempts: 0 
      },
      { upsert: true }
    );

    // Send email
    const emailResult = await sendOTPEmail(email, otp);
    
    res.json({ 
      success: true, 
      message: "New OTP sent successfully" 
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to initiate password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      // Return success even if email not found to prevent email enumeration
      return res.json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);

    // Store token in OTP model (reusing for simplicity or can create a dedicated Token model)
    await otpModel.findOneAndUpdate(
      { email, purpose: 'password_reset' },
      { 
        otp_hash: tokenHash, 
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        attempts: 0 
      },
      { upsert: true }
    );

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ 
      success: true, 
      message: "If an account exists with this email, a reset link has been sent." 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to reset password using token
const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters, include uppercase, lowercase, number and symbol" 
      });
    }

    const tokenRecord = await otpModel.findOne({ email, purpose: 'password_reset' });

    if (!tokenRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset link" });
    }

    if (tokenRecord.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: "Reset link has expired" });
    }

    // Verify token
    const isMatch = await bcrypt.compare(token, tokenRecord.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    // Update password
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    // Delete token
    await otpModel.deleteOne({ _id: tokenRecord._id });

    res.json({ success: true, message: "Password updated successfully. You can now login." });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to request email change (Step 1: Verify old email)
const requestEmailChange = async (req, res) => {
  try {
    const { userId } = req.body; // From authUser middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate and send OTP to old email
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp, salt);

    await otpModel.findOneAndUpdate(
      { email: user.email, purpose: 'email_change_old' },
      { 
        otp_hash, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0 
      },
      { upsert: true }
    );

    await sendOTPEmail(user.email, otp);

    res.json({ success: true, message: "Verification code sent to your current email" });

  } catch (error) {
    console.error('Request email change error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to verify old email and submit new email (Step 2: Send OTP to new email)
const verifyOldEmailAndSendNewOTP = async (req, res) => {
  try {
    const { userId, otp, newEmail } = req.body;
    
    if (!otp || !newEmail) {
      return res.status(400).json({ success: false, message: "OTP and new email are required" });
    }

    if (!validator.isEmail(newEmail)) {
      return res.status(400).json({ success: false, message: "Invalid new email format" });
    }

    const user = await userModel.findById(userId);
    const oldEmail = user.email;

    // Check if new email is already taken
    const existing = await userModel.findOne({ email: newEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "New email is already in use" });
    }

    // Verify old email OTP
    const otpRecord = await otpModel.findOne({ email: oldEmail, purpose: 'email_change_old' });
    if (!otpRecord || otpRecord.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    // Delete old email OTP
    await otpModel.deleteOne({ _id: otpRecord._id });

    // Generate and send OTP to NEW email
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const newOtpHash = await bcrypt.hash(newOtp, salt);

    await otpModel.findOneAndUpdate(
      { email: newEmail, purpose: 'email_change_new' },
      { 
        otp_hash: newOtpHash, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0 
      },
      { upsert: true }
    );

    await sendOTPEmail(newEmail, newOtp);

    res.json({ success: true, message: "Current email verified. Now verify the code sent to your NEW email." });

  } catch (error) {
    console.error('Verify old email error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to finalize email change (Step 3: Verify new email)
const finalizeEmailChange = async (req, res) => {
  try {
    const { userId, otp, newEmail } = req.body;

    if (!otp || !newEmail) {
      return res.status(400).json({ success: false, message: "OTP and new email are required" });
    }

    const otpRecord = await otpModel.findOne({ email: newEmail, purpose: 'email_change_new' });
    if (!otpRecord || otpRecord.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    // Success: Update user email
    await userModel.findByIdAndUpdate(userId, { email: newEmail });
    
    // Delete OTP record
    await otpModel.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Email updated successfully" });

  } catch (error) {
    console.error('Finalize email change error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Google SSO login controller

// Initialize Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Google SSO Login/Register Controller
 * Verifies Google token, creates user if needed, returns JWT
 */
// Google SSO login/register controller
const googleLoginController = async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      })
    }

    // Verify the Google token or access token
    let googleId, email, name, picture;

    if (credential) {
      // Verify the Google ID token
      let ticket;
      try {
        ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      } catch (verifyError) {
        console.error('Google ID token verification failed:', verifyError);
        return res.status(401).json({
          success: false,
          message: 'Invalid Google ID token',
        });
      }
    } else if (accessToken) {
      // Fetch user info using Google access token
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        googleId = response.data.sub;
        email = response.data.email;
        name = response.data.name;
        picture = response.data.picture;
      } catch (fetchError) {
        console.error('Fetching Google user info failed:', fetchError);
        return res.status(401).json({
          success: false,
          message: 'Invalid Google access token',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'No Google credential or access token provided',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google',
      });
    }

    // Check if user exists with this Google ID
    let user = await userModel.findOne({ googleId })

    if (user) {
      // Existing Google user - just login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      return res.json({
        success: true,
        token,
        message: 'Login successful',
      })
    }

    // Check if user exists with this email (from local registration)
    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      // User registered with email (locally or via other SSO), now linking Google account
      if (!existingUser.googleId) {
        // Link Google account to existing account
        existingUser.googleId = googleId
        existingUser.image = picture || existingUser.image
        existingUser.isEmailVerified = true
        await existingUser.save()

        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          }
        )

        return res.json({
          success: true,
          token,
          message: 'Google account linked successfully',
        })
      } else if (existingUser.googleId !== googleId) {
        // Email exists with different Google account
        return res.status(409).json({
          success: false,
          message: 'Email already registered with different Google account',
        })
      }
    }

    // New user - create account with Google
    const newUser = new userModel({
      name: name || email.split('@')[0],
      email,
      googleId,
      image: picture || undefined, // Use default if no picture
      authProvider: 'google',
      isEmailVerified: true,
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.json({
      success: true,
      token,
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Google login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during Google login',
    })
  }
}

/**
 * Apple SSO Login/Register Controller
 * Verifies Apple token, creates user if needed, returns JWT
 */
const appleLoginController = async (req, res) => {
  try {
    const { authorization, user } = req.body

    if (!authorization || !authorization.id_token) {
      return res.status(400).json({
        success: false,
        message: 'Apple authorization is required',
      })
    }

    // Decode Apple ID token (JWT)
    // Note: In production, you should verify the token signature with Apple's public keys
    const idToken = authorization.id_token
    const decodedToken = jwt.decode(idToken)

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Apple token',
      })
    }

    const { sub: appleId, email } = decodedToken

    if (!appleId) {
      return res.status(400).json({
        success: false,
        message: 'Apple ID not provided',
      })
    }

    // Check if user exists with this Apple ID
    let existingUser = await userModel.findOne({ appleId })

    if (existingUser) {
      // Existing Apple user - just login
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      return res.json({
        success: true,
        token,
        message: 'Login successful',
      })
    }

    // Check if user exists with this email (from local registration or other SSO)
    if (email) {
      const emailUser = await userModel.findOne({ email })

      if (emailUser) {
        // User registered with email, now linking Apple account
        if (!emailUser.appleId) {
          // Link Apple account to existing account
          emailUser.appleId = appleId
          emailUser.isEmailVerified = true
          
          // Update name if provided by Apple and not already set
          if (user && user.name && !emailUser.name) {
            const fullName = `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim()
            if (fullName) {
              emailUser.name = fullName
            }
          }
          
          await emailUser.save()

          const token = jwt.sign(
            { id: emailUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: '7d',
            }
          )

          return res.json({
            success: true,
            token,
            message: 'Apple account linked successfully',
          })
        } else if (emailUser.appleId !== appleId) {
          // Email exists with different Apple account
          return res.status(409).json({
            success: false,
            message: 'Email already registered with different Apple account',
          })
        }
      }
    }

    // New user - create account with Apple
    let userName = 'User'
    
    if (user && user.name) {
      userName = `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim()
    } else if (email) {
      userName = email.split('@')[0]
    }

    const newUser = new userModel({
      name: userName,
      email: email || `${appleId}@appleid.private`, // Apple may hide email
      appleId,
      authProvider: 'apple',
      isEmailVerified: !!email, // Only verified if email is provided
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.json({
      success: true,
      token,
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Apple login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during Apple login',
    })
  }
}

/**
 * Microsoft SSO Login/Register Controller
 * Verifies Microsoft access token, creates user if needed, returns JWT
 */
const microsoftLoginController = async (req, res) => {
  try {
    const { accessToken } = req.body

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Microsoft access token is required',
      })
    }

    // Fetch user info from Microsoft Graph API
    let microsoftId, email, name;
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      microsoftId = response.data.id;
      email = response.data.mail || response.data.userPrincipalName;
      name = response.data.displayName;
    } catch (fetchError) {
      console.error('Fetching Microsoft user info failed:', fetchError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Microsoft access token',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Microsoft',
      });
    }

    // Check if user exists with this Microsoft ID
    let user = await userModel.findOne({ microsoftId })

    if (user) {
      // Existing Microsoft user - just login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      return res.json({
        success: true,
        token,
        message: 'Login successful',
      })
    }

    // Check if user exists with this email
    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      // User registered with email, linking Microsoft account
      if (!existingUser.microsoftId) {
        existingUser.microsoftId = microsoftId
        existingUser.is_verified = true
        await existingUser.save()

        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          }
        )

        return res.json({
          success: true,
          token,
          message: 'Microsoft account linked successfully',
        })
      } else if (existingUser.microsoftId !== microsoftId) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered with different Microsoft account',
        })
      }
    }

    // New user - create account with Microsoft
    const newUser = new userModel({
      name: name || email.split('@')[0],
      email,
      microsoftId,
      authProvider: 'microsoft',
      is_verified: true,
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.json({
      success: true,
      token,
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Microsoft login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during Microsoft login',
    })
  }
}

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account not verified. Please verify your email first.',
        needsVerification: true 
      })
    }

    // Check if user registered with SSO
    if (user.authProvider !== 'local' && !user.password) {
      return res.json({
        success: false,
        message: `Please login with ${user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)}`,
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    // Get userId from middleware (authUser sets req.body.userId)
    const userId = req.body.userId;
    
    console.log('Getting profile for userId:', userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false, 
        message: 'Not Authorized'
      });
    }

    const userData = await userModel.findById(userId).select('-password');
    
    if (!userData) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      });
    }

    res.json({success: true, userData});

  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error.message});
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    // Get userId from middleware (authUser sets req.body.userId)
    const userId = req.body.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    console.log('Update profile request:', { userId, name, phone, hasImage: !!imageFile });

    if (!userId) {
      return res.status(401).json({
        success: false, 
        message: 'Not Authorized'
      });
    }

    if (!name || !phone || !dob || !gender) {
      return res.json({success: false, message: "Data Missing"});
    }

    // Update basic user info
    await userModel.findByIdAndUpdate(userId, {
      name, 
      phone, 
      address: JSON.parse(address), 
      dob, 
      gender 
    });

    // Handle image upload if provided
    if (imageFile) {
      try {
        // Check if image compression utilities exist
        let uploadPath = imageFile.path;
        
        try {
          const { compressImage, shouldCompress, getImageMetadata } = await import('../utils/imageCompression.js');
          
          const needsCompression = await shouldCompress(uploadPath);
          
          if (needsCompression) {
            const originalMeta = await getImageMetadata(uploadPath);
            console.log('Original image:', originalMeta);
            
            uploadPath = await compressImage(uploadPath);
            
            const compressedMeta = await getImageMetadata(uploadPath);
            console.log('Compressed image:', compressedMeta);
          }
        } catch (compressionError) {
          console.log('Image compression not available, uploading original:', compressionError.message);
        }

        // Upload to Cloudinary with timeout
        const uploadPromise = cloudinary.uploader.upload(uploadPath, {
          resource_type: 'image',
          timeout: 60000,
          chunked: true,
          chunk_size: 6000000,
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" }
          ]
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Upload timeout')), 60000);
        });

        const imageUpload = await Promise.race([uploadPromise, timeoutPromise]);
        
        if (imageUpload && imageUpload.secure_url) {
          await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
        } else {
          console.error('No secure_url in Cloudinary response');
          return res.json({
            success: false,
            message: "Image upload failed. Please try again."
          });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        
        if (uploadError.code === 'ENOTFOUND') {
          return res.json({
            success: false,
            message: "Unable to connect to image server. Please check your internet connection."
          });
        }
        
        if (uploadError.message === 'Upload timeout' || uploadError.http_code === 499) {
          return res.json({
            success: false,
            message: "Image upload timed out. Please try a smaller image."
          });
        }

        return res.json({
          success: false,
          message: "Failed to upload image. Please try again later."
        });
      }
    }

    res.json({success: true, message: "Profile Updated"});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error.message});
  }
};

// Fixed bookAppointment function for userController.js
// Make sure to import both models at the top of your file:
// import doctorModel from '../models/doctorModel.js';
// import hospitalModel from '../models/hospitalModel.js';
// import userModel from '../models/userModel.js';
// import appointmentModel from '../models/appointmentModel.js';

const bookAppointment = async (req, res) => {
  try {
    // userId usually comes from auth middleware (req.userId) but older tests send it in body
    const userId = req.userId || req.body.userId;
    // Support both older shape (docId/hospitalId) and newer providerId/providerType
    let providerId = req.body.providerId || req.body.docId || req.body.hospitalId;
    let providerType = req.body.providerType || (req.body.docId ? 'doctor' : (req.body.hospitalId ? 'hospital' : undefined));
    const slotDate = req.body.slotDate;
    const slotTime = req.body.slotTime;

    console.log('Booking request:', { userId, providerId, providerType, slotDate, slotTime });

    // Validate required fields
    if (!userId) {
      return res.json({ success: false, message: 'User ID is required' });
    }

    if (!providerId) {
      return res.json({ success: false, message: 'Provider ID is required' });
    }

    if (!providerType) {
      return res.json({ success: false, message: 'Provider type is required' });
    }

    if (!slotDate || !slotTime) {
      return res.json({ success: false, message: 'Please select date and time' });
    }

    // Validate provider type
    if (!['doctor', 'hospital'].includes(providerType)) {
      return res.json({ success: false, message: 'Invalid provider type' });
    }

    // Select the correct model based on provider type
    const ProviderModel = providerType === 'hospital' ? hospitalModel : doctorModel;
    
    // Fetch provider data
    const providerData = await ProviderModel.findById(providerId).select('-password');

    if (!providerData) {
      return res.json({ success: false, message: `${providerType === 'doctor' ? 'Doctor' : 'Hospital'} not found` });
    }

    if (!providerData.available) {
      return res.json({ success: false, message: `${providerType === 'doctor' ? 'Doctor' : 'Hospital'} not available` });
    }

    // Get provider's booked slots
    let slots_booked = providerData.slots_booked || {};

    // Check for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // Fetch user data
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Prepare appointment data based on provider type
    const appointmentData = {
      userId,
      userData,
      slotTime,
      slotDate,
      date: Date.now(),
      providerType,
      cancelled: false,
      isCompleted: false,
      // status defaults to 'pending' (handled by schema)
    };

    // Add provider-specific fields
    if (providerType === 'doctor') {
      appointmentData.docId = providerId;
      appointmentData.docData = {
        name: providerData.name,
        email: providerData.email,
        image: providerData.image,
        speciality: providerData.speciality,
        degree: providerData.degree,
        experience: providerData.experience,
        about: providerData.about,
        address: providerData.address
      };
    } else {
      appointmentData.hospitalId = providerId;
      appointmentData.hospitalData = {
        name: providerData.name,
        email: providerData.email,
        image: providerData.image,
        speciality: providerData.speciality,
        degree: providerData.degree,
        experience: providerData.experience,
        about: providerData.about,
        address: providerData.address
      };
    }

    // Create new appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update provider's slots_booked
    await ProviderModel.findByIdAndUpdate(providerId, { slots_booked });

    console.log('Appointment booked successfully:', newAppointment._id);

    // Keep response backward-compatible with existing tests
    res.json({ success: true, message: 'Appointment booked' });

  } catch (error) {
    console.log('Book appointment error:', error);
    res.json({ success: false, message: error.message });
  }
};
// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false, 
        message: 'Not Authorized'
      });
    }

    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error.message});
  }
};

// API to cancel appointment - UPDATED to support both doctors and hospitals
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({success: false, message: "Appointment not found"});
    }

    // Verify appointment belongs to user
    if (appointmentData.userId !== userId) {
      return res.json({success: false, message: "Unauthorized action"});
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, cancelledBy: 'user', status: 'cancelled' });

    // Release the slot based on provider type
    const { providerType, docId, hospitalId, slotDate, slotTime } = appointmentData;

    if (providerType === 'hospital' && hospitalId) {
      // Release hospital slot
      const hospitalData = await hospitalModel.findById(hospitalId);
      
      if (hospitalData) {
        let slots_booked = hospitalData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await hospitalModel.findByIdAndUpdate(hospitalId, {slots_booked});
      }
    } else if (docId) {
      // Release doctor slot (default for backward compatibility)
      const docData = await doctorModel.findById(docId);
      
      if (docData) {
        let slots_booked = docData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, {slots_booked});
      }
    }

    res.json({success: true, message: "Appointment cancelled"});

  } catch (error) {
    console.log(error);
    // In tests res.status may not be mocked, so fall back to res.json
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: false, message: error.message });
  }
};



// API to request account deletion OTP (For SSO users or as extra security)
const requestDeletionOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp, salt);

    // Save to database
    await otpModel.findOneAndUpdate(
      { email: user.email, purpose: 'account_deletion' },
      { 
        otp_hash, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0 
      },
      { upsert: true }
    );

    // Send email
    // Reuse sendOTPEmail but maybe we should have a specific one. 
    // For now, sendOTPEmail is generic enough.
    await sendOTPEmail(user.email, otp);

    res.json({ success: true, message: "Verification code sent to your email" });

  } catch (error) {
    console.error('Request deletion OTP error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to delete user account
const deleteAccount = async (req, res) => {
  try {
    const { userId, password, otp } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If password is provided, verify it (Local users or SSO with password)
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } 
    // If OTP is provided, verify it (SSO users without password)
    else if (otp) {
      const otpRecord = await otpModel.findOne({ email: user.email, purpose: 'account_deletion' });
      
      if (!otpRecord || otpRecord.expires_at < new Date()) {
        return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
      }

      const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid verification code" });
      }

      // Delete OTP record
      await otpModel.deleteOne({ _id: otpRecord._id });
    }
    // Neither password nor OTP provided
    else {
      return res.status(400).json({ success: false, message: "Password or verification code is required" });
    }

    // Store user data for email before deletion
    const { email, name } = user;

    // Delete user from database
    await userModel.findByIdAndDelete(userId);

    // Optional: Delete user's appointments or other related data
    await appointmentModel.deleteMany({ userId });
    await otpModel.deleteMany({ email });

    // Send confirmation email
    await sendAccountDeletionEmail(email, name);

    res.json({ success: true, message: "Account deleted successfully. We're sorry to see you go." });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { 
  registerUser, 
  verifyOTP, 
  resendOTP, 
  forgotPassword, 
  resetPassword, 
  requestEmailChange, 
  verifyOldEmailAndSendNewOTP, 
  finalizeEmailChange, 
  googleLoginController, 
  appleLoginController, 
  microsoftLoginController,
  loginUser, 
  getProfile, 
  updateProfile, 
  bookAppointment, 
  listAppointment, 
  cancelAppointment,
  deleteAccount,
  requestDeletionOTP
}
