import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: false },  // Optional for hospital-only appointments
  hospitalId: { type: String, required: true },
  appointmentType: { type: String, required: true, enum: ['doctor', 'hospital'] },
  slotDate: { type: String, required: true },
  sDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  sTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: false },  // Optional for hospital-only appointments
  hospitalData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isComplete: { type: Boolean, default: false }
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel