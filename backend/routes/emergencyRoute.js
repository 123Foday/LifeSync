import express from 'express';
import multer from 'multer';
import { 
    createEmergencyLog, 
    handleAIConversation,
    uploadAudioRecording,
    getEmergencyLogs, 
    getEmergencyLogById,
    updateEmergencyStatus 
} from '../controllers/emergencyController.js';
import authUser from '../middlewares/authUser.js';
import authHospital from '../middlewares/authHospital.js';
import authAdmin from '../middlewares/authAdmin.js';

const emergencyRouter = express.Router();

// Configure multer for audio file uploads
const upload = multer({ 
    dest: 'uploads/emergency-audio/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Accept audio files
        if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'), false);
        }
    }
});

// Middleware to handle both admin and hospital auth
const authAdminOrHospital = async (req, res, next) => {
    // Check for admin token first
    if (req.headers.atoken) {
        try {
            const jwt = await import('jsonwebtoken');
            const token_decode = jwt.verify(req.headers.atoken, process.env.JWT_SECRET);
            if (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                req.adminId = 'admin'; // Set admin identifier
                return next();
            }
        } catch (error) {
            // Not admin, continue to hospital auth
        }
    }
    
    // Try hospital auth
    try {
        const authHeader = req.headers.authorization || req.headers.htoken;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Not Authorized, Login again' });
        }

        const jwt = await import('jsonwebtoken');
        const hToken = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
            ? authHeader.split(' ')[1]
            : authHeader;

        const token_decode = jwt.verify(hToken, process.env.JWT_SECRET);
        req.hospitalId = token_decode.id || token_decode._id || token_decode.hospitalId;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message || "Token invalid or expired" });
    }
};

// Public routes (for emergency calls - no auth required)
emergencyRouter.post('/create', createEmergencyLog);
emergencyRouter.post('/ai-conversation', handleAIConversation);
emergencyRouter.post('/upload-audio', upload.single('audio'), uploadAudioRecording);

// Protected routes (for hospital/admin dashboard)
// Note: Specific routes must come before parameterized routes
emergencyRouter.get('/all', authAdminOrHospital, getEmergencyLogs);
emergencyRouter.post('/update-status/:id', authAdminOrHospital, updateEmergencyStatus);
emergencyRouter.get('/:id', authAdminOrHospital, getEmergencyLogById);

export default emergencyRouter;
