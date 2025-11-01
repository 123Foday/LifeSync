// Duplicate doctorController.js and modify all references:
// - Change 'doctor' to 'hospital'
// - Update model imports
// - Keep the same logic structure

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import hospitalModel from "../models/hospitalModel.js";
import appointmentModel from "../models/appointmentModel.js";

const changeHospitalAvailability = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    const hospitalData = await hospitalModel.findById(hospitalId);
    if (!hospitalData) {
      return res.json({ success: false, message: 'Hospital not found' })
    }
    await hospitalModel.findByIdAndUpdate(hospitalId, { available: !hospitalData.available });
    res.json({ success: true, message: 'Availability Changed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const hospitalList = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, hospitals });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for Hospital Login
const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await hospitalModel.findOne({ email });
    if (!hospital) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (isMatch) {
      const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to Get Hospital Appointments
const getHospitalAppointments = async (req, res) => {
  try {
    const hospitalId = req.hospitalId
    const appointments = await appointmentModel.find({ hospitalId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to mark appointment completed for hospital panel
const appointmentComplete = async (req, res) => {

  try {

    const { appointmentId } = req.body
    const hospitalId = req.hospitalId
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && String(appointmentData.hospitalId) === String(hospitalId)) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isComplete: true })
      return res.json({ success: true, message: 'Appointment Completed' })
    } else {
      return res.json({ success: false, message: 'Mark Failed' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to cancel appointment for hospital panel
const appointmentCancel = async (req, res) => {

  try {

    const { appointmentId } = req.body
    const Id = req.Id

    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && String(appointmentData.Id) === String(Id)) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment Cancelled' })
    } else {
      return res.json({ success: false, message: 'Cancellation Failed' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get dashboard data for hospital panel
const hospitalDashboard = async (req, res) => {

  try {

    const hospitalId = req.hospitalId

    const appointments = await appointmentModel.find({ hospitalId })

    let earnings = 0

    appointments.map((item) => {
      if (item.isComplete || item.payment) {
        earnings += item.amount
      }
    })

    let patients = []

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to get hospital profile for Hospital Panel
const getHospitalProfile = async (req, res) => {

  try {

    const hospitalId = req.hospitalId
    const profileData = await hospitalModel.findById(hospitalId).select('-password')

    res.json({ success: true, profileData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to update Hospital profile data from hospital Panel
const updateHospitalProfile = async (req, res) => {

  try {

    const { name, address, phone } = req.body
    const hospitalId = req.hospitalId

    await hospitalModel.findByIdAndUpdate(hospitalId, { name, address, phone })

    res.json({ success: true, message: "Profile Updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}



export {
  changeHospitalAvailability,
  hospitalList,
  loginHospital,
  hospitalDashboard,
  getHospitalProfile,
  updateHospitalProfile,
  getHospitalAppointments,
  appointmentComplete,
  appointmentCancel
}; 
