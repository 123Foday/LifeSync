import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import hospitalModel from '../models/hospitalModel.js';

export const bookAppointment = async (req, res) => {
  try {
    const {
      appointmentType,
      slotDate,
      sDate,
      slotTime,
      sTime,
      hospitalId,
      // docId // Optional for hospital appointments
    } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!slotDate || !slotTime || !hospitalId || !appointmentType) {
      return res.json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Validate appointment type
    if (!['doctor', 'hospital'].includes(appointmentType)) {
      return res.json({ 
        success: false, 
        message: "Invalid appointment type" 
      });
    }

    // For doctor appointments, docId is required
    if (appointmentType === 'doctor' && !docId) {
      return res.json({ 
        success: false, 
        message: "Doctor ID is required for doctor appointments" 
      });
    }

    // Get hospital data
    const hospitalData = await hospitalModel.findById(hospitalId);
    if (!hospitalData) {
      return res.json({ 
        success: false, 
        message: "Hospital not found" 
      });
    }

    // Get doctor data if it's a doctor appointment
    let docData = null;
    if (appointmentType === 'doctor') {
      docData = await doctorModel.findById(docId);
      if (!docData) {
        return res.json({ 
          success: false, 
          message: "Doctor not found" 
        });
      }

      // Check if slot is available for doctor
      if (docData.slots_booked?.[slotDate]?.includes(slotTime)) {
        return res.json({ 
          success: false, 
          message: "Selected slot is not available" 
        });
      }

      // Update doctor's booked slots
      if (!docData.slots_booked[slotDate]) {
        docData.slots_booked[slotDate] = [];
      }
      docData.slots_booked[slotDate].push(slotTime);
      await docData.save();
    }

    // Check if slot is available for hospital
    if (hospitalData.slots_booked?.[slotDate]?.includes(slotTime)) {
      return res.json({ 
        success: false, 
        message: "Selected slot is not available at the hospital" 
      });
    }

    // Update hospital's booked slots
    if (!hospitalData.slots_booked[slotDate]) {
      hospitalData.slots_booked[slotDate] = [];
    }
    hospitalData.slots_booked[slotDate].push(slotTime);
    await hospitalData.save();

    // Create the appointment
    const appointmentData = {
      userId,
      hospitalId,
      appointmentType,
      slotDate,
      sDate,
      slotTime,
      sTime,
      date: Date.now(),
      hospitalData: {
        name: hospitalData.name,
        address: hospitalData.address,
        image: hospitalData.image
      }
    };

    // Add doctor data if it's a doctor appointment
    if (appointmentType === 'doctor' && docData) {
      appointmentData.docId = docId;
      appointmentData.docData = {
        name: docData.name,
        speciality: docData.speciality,
        image: docData.image
      };
    }

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ 
      success: true, 
      message: "Appointment booked successfully" 
    });

  } catch (error) {
    console.error(error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};