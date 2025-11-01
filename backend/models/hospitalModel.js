import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true }, // e.g., "General Hospital", "Specialist Clinic"
    degree: { type: String, required: true }, // Hospital accreditation/certification
    experience: { type: String, required: true }, // Years in operation
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slot_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const hospitalModel =  mongoose.models.hospital || mongoose.model("hospital", hospitalSchema);
export default hospitalModel;