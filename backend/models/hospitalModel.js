import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: {
      type: String,
      required: true,
      // Examples: "General Hospital", "Specialist Clinic", "Maternity Hospital", "Pediatric Hospital", "Emergency Center"
    },
    degree: {
      type: String,
      required: true,
      // Hospital accreditation/certification (e.g., "JCI Accredited", "ISO Certified", "Government Approved")
    },
    experience: {
      type: String,
      required: true,
      // Years in operation (e.g., "15 Years", "Established 2005")
    },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const hospitalModel =
  mongoose.models.hospital || mongoose.model("hospital", hospitalSchema);

export default hospitalModel;
