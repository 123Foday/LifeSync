import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: false },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital', required: false },
    type: { 
        type: String, 
        required: true,
        enum: ['appointment_booked', 'appointment_cancelled', 'appointment_completed', 'new_doctor', 'new_hospital']
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
