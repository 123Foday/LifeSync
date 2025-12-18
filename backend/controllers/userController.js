import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import hospitalModel from '../models/hospitalModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { OAuth2Client } from "google-auth-library";// your User schema


// API to register user
const registerUser = async (req, res) => {
  
  try {
    
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({success: false, message: "Missing Details"})
    } 

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Enter a valid email"})
    }

    // validating a strong password
    if (password.length < 8) {
      return res.json({success: false, message: "Enter a strong password"})
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET )
    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

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

    // Verify the Google token
    let ticket
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError)
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      })
    }

    // Extract user info from verified token
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google',
      })
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
      // User registered with email/password, now linking Google account
      if (existingUser.authProvider === 'local' && !existingUser.googleId) {
        // Link Google account to existing local account
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
      } else if (existingUser.googleId && existingUser.googleId !== googleId) {
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

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
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
    // userId comes from authUser middleware
    const { userId, providerId, providerType, slotDate, slotTime } = req.body;

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
      amount: providerData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
      providerType,
      cancelled: false,
      payment: false,
      isCompleted: false
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
        fees: providerData.fees,
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
        fees: providerData.fees,
        address: providerData.address
      };
    }

    // Create new appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update provider's slots_booked
    await ProviderModel.findByIdAndUpdate(providerId, { slots_booked });

    console.log('Appointment booked successfully:', newAppointment._id);

    res.json({ 
      success: true, 
      message: 'Appointment Booked Successfully',
      appointmentId: newAppointment._id
    });

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
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false, 
        message: 'Not Authorized'
      });
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
    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});

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
    res.status(500).json({success: false, message: error.message});
  }
};

// Razorpay instance

/*const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment of appointment using razorpay
const makePayment = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100,  // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log('Razorpay payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};*/

export { registerUser, googleLoginController, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, /*makePayment*/ };