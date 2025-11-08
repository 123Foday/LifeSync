import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String }, // Optional - only for doctors
  hospitalId: { type: String }, // Optional - only for hospitals
  providerType: { type: String, enum: ["doctor", "hospital"], required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object }, // Optional - only for doctors
  hospitalData: { type: Object }, // Optional - only for hospitals
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel