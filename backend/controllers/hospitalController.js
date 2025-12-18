import hospitalModel from "../models/hospitalModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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
};
