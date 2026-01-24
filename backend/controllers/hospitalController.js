import hospitalModel from "../models/hospitalModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from 'cloudinary'
import { createNotification } from "./notificationController.js";


const changeHospitalAvailability = async (req, res) => {
  try {
    // Support hospitalId provided in body or injected by authHospital middleware
    const hospitalId = req.body?.hospitalId || req.hospitalId

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' })
    }

    const hospData = await hospitalModel.findById(hospitalId)
    if (!hospData) {
      return res.json({ success: false, message: 'Hospital not found' })
    }

    await hospitalModel.findByIdAndUpdate(hospitalId, { available: !hospData.available })
    res.json({ success: true, message: 'Availability Changed' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get all hospitals list for frontend
const hospitalList = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find({}).select("-password");
    res.json({ success: true, hospitals });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for hospital login
const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await hospitalModel.findOne({ email });

    if (!hospital) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);

    if (isMatch) {
      const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get hospital appointments for hospital panel
const appointmentsHospital = async (req, res) => {
  try {
    // Support hospitalId provided in body or injected by authHospital middleware
    const hospitalId = req.body?.hospitalId || req.hospitalId;

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    const appointments = await appointmentModel.find({
      hospitalId,
      providerType: "hospital",
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for hospital panel
const appointmentComplete = async (req, res) => {
  try {
    // Support hospitalId and appointmentId from body or injected data
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { appointmentId } = req.body || {};

    if (!hospitalId || !appointmentId) {
      return res.json({ success: false, message: 'Missing hospitalId or appointmentId' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.hospitalId === hospitalId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true, status: 'booked' });
      
      // Create notification for Admin
      await createNotification(
        'appointment_completed', 
        'Appointment Booked', 
        `Hospital has accepted the appointment for ${appointmentData.userData.name} on ${appointmentData.slotDate}`,
        { hospitalId: hospitalId }
      );

      // Create notification for User
      await createNotification(
        'appointment_completed',
        'Appointment Accepted',
        `Hospital ${appointmentData.hospitalData.name} has accepted your appointment for ${appointmentData.slotDate}.`,
        { userId: appointmentData.userId }
      );

      return res.json({ success: true, message: "Appointment Booked" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for hospital panel
const appointmentCancel = async (req, res) => {
  try {
    // Support hospitalId and appointmentId from body or injected data
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { appointmentId } = req.body || {};

    if (!hospitalId || !appointmentId) {
      return res.json({ success: false, message: 'Missing hospitalId or appointmentId' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.hospitalId === hospitalId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
        cancelledBy: 'hospital',
        status: 'rejected'
      });

      // Release the appointment slot
      const { slotDate, slotTime } = appointmentData;

      const hospitalData = await hospitalModel.findById(hospitalId);

      let slots_booked = hospitalData.slots_booked;

      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      await hospitalModel.findByIdAndUpdate(hospitalId, { slots_booked });

      // Create notification for Admin
      await createNotification(
        'appointment_cancelled', 
        'Appointment Cancelled', 
        `Hospital has rejected the appointment for ${appointmentData.userData.name} on ${appointmentData.slotDate}`,
        { hospitalId: hospitalId }
      );

      // Create notification for User
      await createNotification(
        'appointment_cancelled',
        'Appointment Rejected',
        `Hospital ${appointmentData.hospitalData.name} has rejected your appointment for ${appointmentData.slotDate}.`,
        { userId: appointmentData.userId }
      );

      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for hospital panel
const hospitalDashboard = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    const appointments = await appointmentModel.find({
      hospitalId,
      providerType: "hospital",
    });

    const statusDistribution = [
      { name: 'Completed', value: appointments.filter(a => a.isCompleted).length },
      { name: 'Cancelled', value: appointments.filter(a => a.cancelled).length },
      { name: 'Active', value: appointments.filter(a => !a.isCompleted && !a.cancelled).length }
    ]

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
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get hospital profile for hospital panel
const hospitalProfile = async (req, res) => {
  try {
    // Support hospitalId from body or injected by authHospital middleware
    const hospitalId = req.body?.hospitalId || req.hospitalId;

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    const profileData = await hospitalModel
      .findById(hospitalId)
      .select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update hospital profile data from hospital panel
const updateHospitalProfile = async (req, res) => {
  try {
    // Support hospitalId from body or injected by authHospital middleware
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { address, available } = req.body || {};

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    await hospitalModel.findByIdAndUpdate(hospitalId, {
      address,
      available,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get hospital doctors
const getHospitalDoctors = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    const doctors = await doctorModel.find({ hospitalId }).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add doctor to hospital
const addDoctorToHospital = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { doctorId } = req.body;

    if (!hospitalId || !doctorId) {
      return res.json({ success: false, message: 'Missing hospitalId or doctorId' });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    // Check if doctor is already assigned to this hospital
    if (doctor.hospitalId === hospitalId) {
      return res.json({ success: false, message: 'Doctor already assigned to this hospital' });
    }

    // Update doctor with hospitalId
    await doctorModel.findByIdAndUpdate(doctorId, { hospitalId });

    res.json({ success: true, message: 'Doctor added to hospital' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to remove doctor from hospital
const removeDoctorFromHospital = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { doctorId } = req.body;

    if (!hospitalId || !doctorId) {
      return res.json({ success: false, message: 'Missing hospitalId or doctorId' });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    // Check if doctor belongs to this hospital
    if (doctor.hospitalId !== hospitalId) {
      return res.json({ success: false, message: 'Doctor not assigned to this hospital' });
    }

    // Remove hospitalId (set to null)
    await doctorModel.findByIdAndUpdate(doctorId, { hospitalId: null });

    res.json({ success: true, message: 'Doctor removed from hospital' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for hospital to create a new doctor (multipart/form-data)
const hospitalAddDoctor = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const imageFile = req.file;

    const { name, email, password, speciality, degree, experience, about, address } = req.body || {};

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    // basic validation similar to admin addDoctor
    if (!name || !email || !password || !speciality || !degree || !experience || !about) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image
    let imageUrl = '';
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      imageUrl = imageUpload.secure_url;
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      address: address ? JSON.parse(address) : {},
      date: Date.now(),
      hospitalId: hospitalId || null,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to assign a doctor to a hospital appointment
const assignDoctorToAppointment = async (req, res) => {
  try {
    const hospitalId = req.body?.hospitalId || req.hospitalId;
    const { appointmentId, doctorId } = req.body;

    if (!hospitalId || !appointmentId || !doctorId) {
      return res.json({ success: false, message: 'Missing Required Fields' });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.hospitalId !== hospitalId) {
      return res.json({ success: false, message: 'Wait, this appointment does not belong to your hospital' });
    }

    const doctor = await doctorModel.findById(doctorId).select('-password');
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    if (doctor.hospitalId !== hospitalId) {
      return res.json({ success: false, message: 'Doctor is not affiliated with this hospital' });
    }

    // Update appointment with doctor data
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      docId: doctorId,
      docData: {
        name: doctor.name,
        email: doctor.email,
        image: doctor.image,
        speciality: doctor.speciality,
        degree: doctor.degree,
        experience: doctor.experience,
        about: doctor.about,
        address: doctor.address
      },
      status: 'pending' // Still pending until doctor/hospital completes it
    });

    // Create notification for Doctor
    await createNotification(
      'appointment_assigned',
      'New Task Assigned',
      `You have been assigned a new appointment for patient ${appointment.userData.name} on ${appointment.slotDate}`,
      { doctorId }
    );

    // Create notification for User
    await createNotification(
      'appointment_updated',
      'Doctor Assigned',
      `Your appointment at ${appointment.hospitalData.name} has been assigned to Dr. ${doctor.name}.`,
      { userId: appointment.userId }
    );

    res.json({ success: true, message: `Appointment assigned to Dr. ${doctor.name}` });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  hospitalList,
  loginHospital,
  appointmentsHospital,
  appointmentComplete,
  appointmentCancel,
  hospitalDashboard,
  hospitalProfile,
  updateHospitalProfile,
  changeHospitalAvailability,
  getHospitalDoctors,
  addDoctorToHospital,
  removeDoctorFromHospital,
  hospitalAddDoctor,
  assignDoctorToAppointment,
};
