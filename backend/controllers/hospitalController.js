import hospitalModel from "../models/hospitalModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from 'cloudinary'

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
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
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
      });

      // Release the appointment slot
      const { slotDate, slotTime } = appointmentData;

      const hospitalData = await hospitalModel.findById(hospitalId);

      let slots_booked = hospitalData.slots_booked;

      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      await hospitalModel.findByIdAndUpdate(hospitalId, { slots_booked });

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
    // Support hospitalId from body or injected by authHospital middleware
    const hospitalId = req.body?.hospitalId || req.hospitalId;

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    const appointments = await appointmentModel.find({
      hospitalId,
      providerType: "hospital",
    });

    let earnings = 0;

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
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
    const { fees, address, available } = req.body || {};

    if (!hospitalId) {
      return res.json({ success: false, message: 'Missing hospitalId' });
    }

    await hospitalModel.findByIdAndUpdate(hospitalId, {
      fees,
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
};
