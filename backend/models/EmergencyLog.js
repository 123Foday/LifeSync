import mongoose from 'mongoose';

const emergencyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hospital',
        default: null // null means main call center (admin)
    },
    callCenterType: {
        type: String,
        enum: ['main', 'hospital'],
        default: 'main' // 'main' for admin panel, 'hospital' for hospital-specific
    },
    callId: {
        type: String,
        unique: true,
        default: () => `EMG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    conversation: [{
        sender: {
            type: String, // 'AI', 'User', or 'Agent'
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    fullTranscription: {
        type: String, // Complete transcript of the entire call
        default: ''
    },
    audioRecordingUrl: {
        type: String, // URL to stored audio file (Cloudinary or similar)
        default: null
    },
    summary: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Routed to Agent', 'Resolved', 'False Alarm'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'High'
    },
    location: {
        type: String, // Could be formatted address or lat,long
        default: 'Unknown'
    },
    contactNumber: {
        type: String
    },
    callerName: {
        type: String,
        default: 'Anonymous'
    },
    emergencyType: {
        type: String, // e.g., 'Medical', 'Accident', 'Fire', 'Other'
        default: 'Medical'
    },
    routedToAgent: {
        type: Boolean,
        default: false
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming agents are users with special role
        default: null
    },
    routedAt: {
        type: Date,
        default: null
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    aiAnalysis: {
        sentiment: String, // 'calm', 'panicked', 'urgent', 'distressed'
        urgencyScore: Number, // 1-10
        extractedInfo: {
            symptoms: [String],
            medications: [String],
            allergies: [String],
            medicalHistory: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
emergencyLogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const EmergencyLog = mongoose.model('EmergencyLog', emergencyLogSchema);

export default EmergencyLog;
