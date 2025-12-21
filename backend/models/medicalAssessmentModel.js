import mongoose from "mongoose";

const medicalAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    // EndlessMedical Session Info
    sessionId: {
      type: String,
      required: true,
    },

    // Patient Data at time of assessment
    patientData: {
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },
      symptoms: [
        {
          type: String,
          required: true,
        },
      ],
    },

    // Analysis Results from EndlessMedical API
    analysis: {
      diseases: [
        {
          name: String,
          probability: Number,
          icd10Code: String,
        },
      ],
      rawResponse: mongoose.Schema.Types.Mixed,
    },

    // Assessment Status
    status: {
      type: String,
      enum: ["pending", "completed", "error"],
      default: "pending",
    },

    // Error information if assessment failed
    errorMessage: String,

    // Timestamps
    completedAt: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create indexes for better query performance
medicalAssessmentSchema.index({ userId: 1, createdAt: -1 });
medicalAssessmentSchema.index({ status: 1 });

const medicalAssessmentModel =
  mongoose.models.medicalAssessment ||
  mongoose.model("medicalAssessment", medicalAssessmentSchema);

export default medicalAssessmentModel;
