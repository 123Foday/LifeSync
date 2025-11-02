import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import hospitalModel from '../models/hospitalModel.js'
import appointmentModel from '../models/appointmentModel.js'

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

// API for user login
const loginUser = async (req, res) => {
  
  try {
    
    const { email, password } = req.body
    const user = await userModel.findOne({email})

    if (!user) {
      return res.json({success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
      res.json({success: true, token})
    } else {
      res.json({success: false, message: 'Invalid credentials'})
    }

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  
  try {
    
    // prefer userId set by auth middleware, fall back to req.body for compatibility
    const userId = req.userId || (req.body && req.body.userId)
    const userData = await userModel.findById(userId).select('-password')

    res.json({success: true, userData})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to update user profile
const updateProfile = async (req, res) => {
  
  try {

    // prefer userId set by auth middleware, fall back to req.body for compatibility
    const userId = req.userId || (req.body && req.body.userId)
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({success: false, message: "Data Missing"})
    }

    await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address), dob, gender })

    if (imageFile) {
      try {
        // Import image compression utilities
        const { compressImage, shouldCompress, getImageMetadata } = await import('../utils/imageCompression.js');
        
        let uploadPath = imageFile.path;
        const needsCompression = await shouldCompress(uploadPath);
        
        if (needsCompression) {
          // Get original image metadata
          const originalMeta = await getImageMetadata(uploadPath);
          console.log('Original image:', originalMeta);
          
          // Compress the image
          uploadPath = await compressImage(uploadPath);
          
          // Get compressed image metadata
          const compressedMeta = await getImageMetadata(uploadPath);
          console.log('Compressed image:', compressedMeta);
        }

        // Set a timeout for the Cloudinary upload
        const uploadPromise = cloudinary.uploader.upload(uploadPath, {
          resource_type: 'image',
          timeout: 60000, // 60 seconds timeout
          chunked: true, // Enable chunked uploads
          chunk_size: 6000000, // 6MB chunks
          transformation: [
            { quality: "auto:good" }, // Let Cloudinary optimize quality
            { fetch_format: "auto" }  // Auto-select best format
          ]
        });

        // Add timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Upload timeout'));
          }, 60000);
        });

        // Race between upload and timeout
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
        
        // If it's a network error
        if (uploadError.code === 'ENOTFOUND') {
          return res.json({
            success: false,
            message: "Unable to connect to image server. Please check your internet connection and try again."
          });
        }
        
        // If it's a timeout
        if (uploadError.message === 'Upload timeout' || uploadError.http_code === 499) {
          return res.json({
            success: false,
            message: "Image upload timed out. Please try again with a smaller image or better connection."
          });
        }

        // For other errors
        return res.json({
          success: false,
          message: "Failed to upload image. Please try again later."
        });
      }
    }

    res.json({success: true, message: "Profile Updated"})
    
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to book an appointment
const bookAppointment = async (req, res) => {
  
  try {

    const { 
      docId, 
      hospitalId, 
      sDate, 
      slotDate, 
      sTime, 
      slotTime,
      amount 
    } = req.body;
    
    const userId = req.userId;

    // Validate required fields
    if (!userId || !hospitalId || !slotDate || !slotTime || !amount) {
      return res.json({
        success: false, 
        message: "Missing required fields"
      });
    }

    // Get user data first
    const userData = await userModel.findById(userId).select('-password');
    if (!userData) {
      return res.json({
        success: false,
        message: "User profile not found"
      });
    }

    // Get doctor data if provided
    let docData = null;
    if (docId) {
      docData = await doctorModel.findById(docId).select('-password');
      if (!docData) {
        return res.json({
          success: false,
          message: "Doctor not found"
        });
      }
      if (!docData.available) {
        return res.json({
          success: false,
          message: "Doctor not available"
        });
      }
    }

    // Get hospital data
    const hospitalData = await hospitalModel.findById(hospitalId).select('-password');
    if (!hospitalData) {
      return res.json({
        success: false,
        message: "Hospital not found"
      });
    }

    // Check hospital slot availability first
    let hospitalSlots = hospitalData.slots_booked || {};
    if (hospitalSlots[slotDate]?.includes(slotTime)) {
      return res.json({
        success: false,
        message: "This time slot is not available at the hospital"
      });
    }

    // If it's a doctor appointment, check doctor's availability
    if (docData) {
      let doctorSlots = docData.slots_booked || {};
      if (doctorSlots[slotDate]?.includes(slotTime)) {
        return res.json({
          success: false,
          message: "Doctor is not available at this time"
        });
      }

      // Update doctor's slots
      if (!doctorSlots[slotDate]) {
        doctorSlots[slotDate] = [];
      }
      doctorSlots[slotDate].push(slotTime);
      docData.slots_booked = doctorSlots;
      await docData.save();
    }

    // Update hospital's slots
    if (!hospitalSlots[slotDate]) {
      hospitalSlots[slotDate] = [];
    }
    hospitalSlots[slotDate].push(slotTime);
    hospitalData.slots_booked = hospitalSlots;
    await hospitalData.save();

    const appointmentData = {
      userId,
      hospitalId,
      userData,
      hospitalData: {
        name: hospitalData.name,
        address: hospitalData.address,
        image: hospitalData.image
      },
      amount,
      slotTime,
      sTime,
      slotDate,
      sDate,
      date: Date.now(),
      appointmentType: docId ? 'doctor' : 'hospital'
    };

    // Add doctor data if it's a doctor appointment
    if (docData) {
      appointmentData.docId = docId;
      appointmentData.docData = {
        name: docData.name,
        speciality: docData.speciality,
        image: docData.image,
        fees: docData.fees
      };
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success: true, message: "Appointment booked"})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  
  try {
    
    const userId = req.userId
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  
  try {
    
    const { appointmentId } = req.body
    const userId = req.userId

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({success: false, message: "Unauthorized action"})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData

    const docData = await doctorModel.findById(docId)

    let slots_booked = docData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success: true, message: "Appointment cancelled"})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// Razorpay instance


// API to make payment of appointment using razorpay


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }