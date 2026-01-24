import EmergencyLog from '../models/EmergencyLog.js';
import { analyzeEmergencyConversation, generateSummary } from '../services/emergencyAIService.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new emergency log
const createEmergencyLog = async (req, res) => {
    try {
        const { conversation, summary, location, contactNumber, priority, callerName, emergencyType } = req.body;
        // Optionally attach userId if authenticated, but emergency might be anonymous
        const userId = req.user ? req.user.id : null;

        // Generate full transcription from conversation
        const fullTranscription = conversation
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');

        const newLog = new EmergencyLog({
            userId,
            conversation,
            fullTranscription,
            summary,
            location,
            contactNumber,
            callerName: callerName || 'Anonymous',
            emergencyType: emergencyType || 'Medical',
            priority: priority || 'High'
        });

        const savedLog = await newLog.save();
        res.status(201).json({ success: true, data: savedLog });
    } catch (error) {
        console.error('Error creating emergency log:', error);
        res.status(500).json({ success: false, message: 'Failed to create emergency record' });
    }
};

// AI-powered conversation handler
const handleAIConversation = async (req, res) => {
    try {
        const { callId, userMessage, conversation, hospitalId, callCenterType } = req.body;

        if (!userMessage || !conversation) {
            return res.status(400).json({ 
                success: false, 
                message: 'User message and conversation history are required' 
            });
        }

        // Analyze conversation with AI
        const aiAnalysis = await analyzeEmergencyConversation(conversation, userMessage);

        // Determine call center type and hospital
        const finalHospitalId = hospitalId || null;
        const finalCallCenterType = callCenterType || (finalHospitalId ? 'hospital' : 'main');

        // Update or create emergency log
        let emergencyLog;
        if (callId) {
            emergencyLog = await EmergencyLog.findOne({ callId });
        }

        const updatedConversation = [
            ...conversation,
            { sender: 'User', text: userMessage, timestamp: new Date() },
            { sender: 'AI', text: aiAnalysis.response, timestamp: new Date() }
        ];

        const fullTranscription = updatedConversation
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');

        const summary = generateSummary(updatedConversation, aiAnalysis.extractedInfo);

        if (emergencyLog) {
            // Update existing log
            emergencyLog.conversation = updatedConversation;
            emergencyLog.fullTranscription = fullTranscription;
            emergencyLog.summary = summary;
            emergencyLog.priority = aiAnalysis.priority;
            emergencyLog.aiAnalysis = {
                sentiment: aiAnalysis.sentiment,
                urgencyScore: aiAnalysis.urgencyScore,
                extractedInfo: aiAnalysis.extractedInfo
            };

            // Update extracted info
            if (aiAnalysis.extractedInfo.name) {
                emergencyLog.callerName = aiAnalysis.extractedInfo.name;
            }
            if (aiAnalysis.extractedInfo.location) {
                emergencyLog.location = aiAnalysis.extractedInfo.location;
            }
            if (aiAnalysis.extractedInfo.contactNumber) {
                emergencyLog.contactNumber = aiAnalysis.extractedInfo.contactNumber;
            }
            if (aiAnalysis.extractedInfo.emergencyType) {
                emergencyLog.emergencyType = aiAnalysis.extractedInfo.emergencyType;
            }

            // Route to agent if needed
            if (aiAnalysis.shouldRoute) {
                emergencyLog.status = 'Routed to Agent';
                emergencyLog.routedToAgent = true;
                emergencyLog.routedAt = new Date();
            }

            await emergencyLog.save();
        } else {
            // Create new log
            const newLog = new EmergencyLog({
                hospitalId: finalHospitalId,
                callCenterType: finalCallCenterType,
                conversation: updatedConversation,
                fullTranscription,
                summary,
                location: aiAnalysis.extractedInfo.location || 'Unknown',
                contactNumber: aiAnalysis.extractedInfo.contactNumber,
                callerName: aiAnalysis.extractedInfo.name || 'Anonymous',
                emergencyType: aiAnalysis.extractedInfo.emergencyType || 'Medical',
                priority: aiAnalysis.priority,
                status: aiAnalysis.shouldRoute ? 'Routed to Agent' : 'Pending',
                routedToAgent: aiAnalysis.shouldRoute,
                routedAt: aiAnalysis.shouldRoute ? new Date() : null,
                aiAnalysis: {
                    sentiment: aiAnalysis.sentiment,
                    urgencyScore: aiAnalysis.urgencyScore,
                    extractedInfo: aiAnalysis.extractedInfo
                }
            });
            await newLog.save();
            emergencyLog = newLog;
        }

        res.status(200).json({
            success: true,
            data: {
                aiResponse: aiAnalysis.response,
                shouldRoute: aiAnalysis.shouldRoute,
                priority: aiAnalysis.priority,
                callId: emergencyLog.callId,
                status: emergencyLog.status,
                extractedInfo: aiAnalysis.extractedInfo
            }
        });
    } catch (error) {
        console.error('Error handling AI conversation:', error);
        res.status(500).json({ success: false, message: 'Failed to process conversation' });
    }
};

// Upload audio recording
const uploadAudioRecording = async (req, res) => {
    try {
        const { callId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No audio file provided' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video', // Cloudinary treats audio as video
            folder: 'emergency-recordings',
            format: 'mp3',
            timeout: 60000 // 60 second timeout
        });

        // Update emergency log with audio URL
        const emergencyLog = await EmergencyLog.findOne({ callId });
        if (emergencyLog) {
            emergencyLog.audioRecordingUrl = result.secure_url;
            await emergencyLog.save();
        }

        // Clean up local file (optional, but good practice)
        try {
            const fs = await import('fs');
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanupError) {
            console.warn('Could not clean up local file:', cleanupError);
        }

        res.status(200).json({
            success: true,
            data: {
                audioUrl: result.secure_url,
                callId
            }
        });
    } catch (error) {
        console.error('Error uploading audio:', error);
        res.status(500).json({ success: false, message: 'Failed to upload audio recording' });
    }
};

// Get all logs (for admin/hospital dashboard)
const getEmergencyLogs = async (req, res) => {
    try {
        const { status, priority, limit = 50, skip = 0 } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Filter by hospitalId if provided (hospital context)
        if (req.hospitalId) {
            query.hospitalId = req.hospitalId;
            query.callCenterType = 'hospital';
        } else if (req.adminId) {
            // Admin sees only main call center calls
            query.callCenterType = 'main';
            query.hospitalId = null;
        }
        // If neither hospitalId nor adminId, return all (for debugging/development)

        const logs = await EmergencyLog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('userId', 'name email')
            .populate('agentId', 'name email')
            .populate('hospitalId', 'name email');

        const total = await EmergencyLog.countDocuments(query);

        res.status(200).json({ 
            success: true, 
            data: logs,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        console.error('Error fetching emergency logs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch logs' });
    }
};

// Get single emergency log by ID
const getEmergencyLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await EmergencyLog.findById(id)
            .populate('userId', 'name email')
            .populate('agentId', 'name email');

        if (!log) {
            return res.status(404).json({ success: false, message: 'Emergency log not found' });
        }

        res.status(200).json({ success: true, data: log });
    } catch (error) {
        console.error('Error fetching emergency log:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch log' });
    }
};

// Update status (e.g., when an agent takes over)
const updateEmergencyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, agentId } = req.body;

        const updateData = { status };
        if (agentId) {
            updateData.agentId = agentId;
            updateData.routedToAgent = true;
            updateData.routedAt = new Date();
        }
        if (status === 'Resolved') {
            updateData.resolvedAt = new Date();
        }

        const updatedLog = await EmergencyLog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('agentId', 'name email');

        if (!updatedLog) {
            return res.status(404).json({ success: false, message: 'Log not found' });
        }

        res.status(200).json({ success: true, data: updatedLog });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

export { 
    createEmergencyLog, 
    handleAIConversation,
    uploadAudioRecording,
    getEmergencyLogs, 
    getEmergencyLogById,
    updateEmergencyStatus 
};
