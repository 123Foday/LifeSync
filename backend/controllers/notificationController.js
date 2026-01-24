import notificationModel from "../models/notificationModel.js";

// Fetch notifications for a specific user role
const getNotifications = async (req, res) => {
    try {
        const { role, id } = req.query; // role: admin, doctor, hospital. id: optional for doctor/hospital

        let filter = {};
        if (role === 'doctor' && id) {
            filter = { doctorId: id };
        } else if (role === 'hospital' && id) {
            filter = { hospitalId: id };
        } else if (role === 'user' && id) {
            filter = { userId: id };
        } else if (role === 'admin') {
            filter = {}; // Admin sees everything or we can refine this later
        }

        const notifications = await notificationModel.find(filter).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        await notificationModel.findByIdAndUpdate(notificationId, { read: true });
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Clear all notifications for a role
const clearNotifications = async (req, res) => {
    try {
        const { role, id } = req.body;
        let filter = {};
        if (role === 'doctor' && id) filter = { doctorId: id };
        else if (role === 'hospital' && id) filter = { hospitalId: id };
        else if (role === 'user' && id) filter = { userId: id };
        else if (role === 'admin') filter = {};

        await notificationModel.updateMany(filter, { read: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const createNotification = async (type, title, message, details = {}) => {
    try {
        const notification = new notificationModel({
            type,
            title,
            message,
            ...details
        });
        await notification.save();
    } catch (error) {
        console.log("Error creating notification:", error.message);
    }
};

export { getNotifications, markAsRead, clearNotifications, createNotification };
