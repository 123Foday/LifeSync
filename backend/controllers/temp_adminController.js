/*import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import hospitalModel from "../models/hospitalModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// API for adding hospital
const addHospital = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    // checking for all data to add hospital
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
      return res.json({success: false, message: "Missing Details"})
    }

    // validating email format
    if (!validator.isEmail(email)){
      return res.json({success: false, message: "Please enter a valid email"})
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({success: false, message: "Please enter a strong password"})
    }

    // check if hospital email already exists
    const existingHospital = await hospitalModel.findOne({ email })
    if (existingHospital) {
      return res.json({success: false, message: "Hospital with this email already exists"})
    }

    // hashing hospital password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
    const imageUrl = imageUpload.secure_url

    const hospitalData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
      slot_booked: {}
    }

    const newHospital = new hospitalModel(hospitalData)
    await newHospital.save()

    res.json({success: true, message: "Hospital Added Successfully"})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

// API to get all hospitals
const allHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find({}).select('-password')
    res.json({success: true, hospitals})
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

module.exports = {
  addHospital,
  allHospitals,
  // Add other exports as needed
}*/