import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { createNotification } from './notificationController.js';


const changeAvailability = async (req, res) => {
  try {

    const { docId } = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability Changed' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const doctorList = async (req, res) => {

  try {

    const doctors = await doctorModel.find({}).select(['-password', '-email'])

    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for doctor Login
const loginDoctor = async (req, res) => {

  try {

    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })

    } else {
      res.json({ success: false, message: "invalid credentials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {

  try {

    const docId = req.docId
    const appointments = await appointmentModel.find({ docId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {

  try {

    const { appointmentId } = req.body
    const docId = req.docId

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {

      // When doctor accepts/completes the appointment, mark it as booked
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true, status: 'booked' })
      
      // Create notification for Admin
      await createNotification(
        'appointment_completed', 
        'Appointment Booked', 
        `Doctor has accepted the appointment for ${appointmentData.userData.name} on ${appointmentData.slotDate}`,
        { doctorId: docId }
      );

      // Create notification for User
      await createNotification(
        'appointment_completed',
        'Appointment Accepted',
        `Doctor ${appointmentData.docData.name} has accepted your appointment for ${appointmentData.slotDate}.`,
        { userId: appointmentData.userId }
      );

      return res.json({ success: true, message: "Appointment Booked" })

    } else {
      return res.json({ success: false, message: "Mark Failed" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {

  try {

    const { appointmentId } = req.body
    const docId = req.docId

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {

      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, cancelledBy: 'doctor', status: 'rejected' })
      
      // Create notification for Admin
      await createNotification(
        'appointment_cancelled', 
        'Appointment Cancelled', 
        `Doctor has rejected the appointment for ${appointmentData.userData.name} on ${appointmentData.slotDate}`,
        { doctorId: docId }
      );

      // Create notification for User
      await createNotification(
        'appointment_cancelled',
        'Appointment Rejected',
        `Doctor ${appointmentData.docData.name} has rejected your appointment for ${appointmentData.slotDate}.`,
        { userId: appointmentData.userId }
      );

      return res.json({ success: true, message: "Appointment Cancelled" })

    } else {
      return res.json({ success: false, message: "Cancellaton Failed" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId
    const appointments = await appointmentModel.find({ docId })

    // Grouping appointments by status
    const statusDistribution = [
      { name: 'Completed', value: appointments.filter(a => a.isCompleted).length },
      { name: 'Cancelled', value: appointments.filter(a => a.cancelled).length },
      { name: 'Active', value: appointments.filter(a => !a.isCompleted && !a.cancelled).length }
    ]

    // Trends for last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const trends = last7Days.map(date => ({
      day: date,
      count: appointments.filter(a => new Date(a.date).toISOString().split('T')[0] === date).length
    }))

    const dashData = {
      bookedCount: appointments.filter(a => a.status === 'booked').length,
      appointments: appointments.length,
      patients: [...new Set(appointments.map(a => a.userId.toString()))].length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
      statusDistribution,
      trends
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {

  try {

    const docId = req.docId
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({ success: true, profileData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to updata Doctor profile date from Doctor Panel
const updateDoctorProfile = async (req, res) => {

  try {

    const { address, available } = req.body
    const docId = req.docId

    await doctorModel.findByIdAndUpdate(docId, { address, available })

    res.json({ success: true, message: "Profile Updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

export {
  changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard,
  doctorProfile, updateDoctorProfile
}