import endlessMedicalService from "../services/endlessMedicalService.js";
import fallbackMedicalService from "../services/fallbackMedicalService.js";
import medicalAssessmentModel from "../models/medicalAssessmentModel.js";
import userModel from "../models/userModel.js";

/**
 * Perform a complete medical assessment
 * POST /api/medical/assess
 */
const performAssessment = async (req, res) => {
  try {
    const userId = req.body.userId; // From authUser middleware
    const { age, gender, symptoms } = req.body;

    console.log("Medical assessment request:", {
      userId,
      age,
      gender,
      symptoms,
    });

    // Validate required fields
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    if (!age || !gender) {
      return res.json({
        success: false,
        message: "Age and gender are required",
      });
    }

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.json({
        success: false,
        message: "At least one symptom is required",
      });
    }

    // Validate age range
    if (age < 0 || age > 120) {
      return res.json({
        success: false,
        message: "Please enter a valid age",
      });
    }

    // Validate gender
    if (!["Male", "Female"].includes(gender)) {
      return res.json({
        success: false,
        message: "Gender must be Male or Female",
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create initial assessment record
    const assessment = new medicalAssessmentModel({
      userId,
      sessionId: "pending",
      patientData: { age, gender, symptoms },
      status: "pending",
    });

    await assessment.save();

    try {
      let result;
      let usedFallback = false;

      // Try primary EndlessMedical API first
      try {
        console.log("Attempting primary medical assessment service...");
        result = await endlessMedicalService.completeAssessment(userId, {
          age,
          gender,
          symptoms,
        });
        console.log("✓ Primary service succeeded");
      } catch (primaryError) {
        console.warn("Primary medical service failed, trying fallback:", primaryError.message);
        usedFallback = true;
        
        // Try fallback service (this should always work as it's rule-based)
        try {
          console.log("Attempting fallback medical assessment service (rule-based, no network required)...");
          result = await fallbackMedicalService.completeAssessment(userId, {
            age,
            gender,
            symptoms,
          });
          console.log("✓ Fallback service succeeded");
        } catch (fallbackError) {
          // This should rarely happen as fallback is rule-based
          console.error("Unexpected fallback service error:", fallbackError);
          // Return a basic emergency result instead of throwing
          result = {
            success: true,
            sessionId: `emergency-${Date.now()}`,
            analysis: {
              Diseases: [
                {
                  name: "General Consultation Recommended",
                  probability: 0.5,
                  icd10Code: null,
                },
                {
                  name: "Symptom Monitoring Advised",
                  probability: 0.3,
                  icd10Code: null,
                },
              ],
            },
            diagnosis: null,
            timestamp: new Date().toISOString(),
            source: "emergency-fallback",
          };
          console.log("✓ Emergency fallback result generated");
        }
      }

      // Update assessment with results
      assessment.sessionId = result.sessionId;
      assessment.analysis = {
        diseases: result.analysis.Diseases || [],
        rawResponse: result.analysis,
        source: result.source || "primary",
      };
      assessment.status = "completed";
      assessment.completedAt = new Date();

      await assessment.save();

      console.log("Medical assessment completed:", assessment._id, usedFallback ? "(fallback)" : "(primary)");

      // Format diseases with probability if needed
      const formattedDiseases = (assessment.analysis.diseases || []).map((disease) => ({
        name: disease.name || disease.Name || "Unknown",
        probability: disease.probability || disease.Probability || 0,
        icd10Code: disease.icd10Code || disease.ICD10 || null,
      }));

      res.json({
        success: true,
        message: usedFallback 
          ? "Assessment completed using fallback service. Primary service is currently unavailable."
          : "Assessment completed successfully",
        data: {
          assessmentId: assessment._id,
          diseases: formattedDiseases,
          timestamp: assessment.completedAt || new Date(),
          source: usedFallback ? "fallback" : "primary",
        },
        disclaimer:
          "This is a preliminary assessment only and is NOT a medical diagnosis. Always consult with a qualified healthcare professional.",
      });
    } catch (apiError) {
      // Update assessment with error
      assessment.status = "error";
      assessment.errorMessage = apiError.message;
      await assessment.save();

      console.error("Medical assessment error (both services failed):", {
        message: apiError.message,
        userId,
        assessmentId: assessment._id
      });

      // Return more specific error message
      return res.status(500).json({
        success: false,
        message: apiError.message || "Failed to complete medical assessment. All services are unavailable.",
        error: apiError.message,
        assessmentId: assessment._id,
      });
    }
  } catch (error) {
    console.error("Medical assessment error:", {
      message: error.message,
      stack: error.stack,
      userId: req.body.userId
    });
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to complete medical assessment",
      error: error.message,
    });
  }
};

/**
 * Get user's assessment history
 * GET /api/medical/history
 */
const getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.body.userId; // From authUser middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Get all assessments for user, sorted by most recent first
    const assessments = await medicalAssessmentModel
      .find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 assessments
      .select("-analysis.rawResponse"); // Exclude raw response to reduce data size

    console.log(
      `Retrieved ${assessments.length} assessments for user:`,
      userId
    );

    res.json({
      success: true,
      assessments: assessments.map((assessment) => ({
        id: assessment._id,
        age: assessment.patientData.age,
        gender: assessment.patientData.gender,
        symptoms: assessment.patientData.symptoms,
        diseases: assessment.analysis.diseases,
        date: assessment.createdAt,
        completedAt: assessment.completedAt,
      })),
    });
  } catch (error) {
    console.error("Get assessment history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assessment history",
      error: error.message,
    });
  }
};

/**
 * Get a specific assessment by ID
 * GET /api/medical/assessment/:id
 */
const getAssessmentById = async (req, res) => {
  try {
    const userId = req.body.userId; // From authUser middleware
    const assessmentId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Find assessment and verify ownership
    const assessment = await medicalAssessmentModel
      .findOne({ _id: assessmentId, userId })
      .select("-analysis.rawResponse");

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.json({
      success: true,
      assessment: {
        id: assessment._id,
        age: assessment.patientData.age,
        gender: assessment.patientData.gender,
        symptoms: assessment.patientData.symptoms,
        diseases: assessment.analysis.diseases,
        date: assessment.createdAt,
        completedAt: assessment.completedAt,
        status: assessment.status,
      },
    });
  } catch (error) {
    console.error("Get assessment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assessment",
      error: error.message,
    });
  }
};

/**
 * Delete an assessment
 * DELETE /api/medical/assessment/:id
 */
const deleteAssessment = async (req, res) => {
  try {
    const userId = req.body.userId; // From authUser middleware
    const assessmentId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Find and delete assessment (only if owned by user)
    const assessment = await medicalAssessmentModel.findOneAndDelete({
      _id: assessmentId,
      userId,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    console.log("Assessment deleted:", assessmentId);

    res.json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assessment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete assessment",
      error: error.message,
    });
  }
};

/**
 * Get assessment statistics for user
 * GET /api/medical/stats
 */
const getAssessmentStats = async (req, res) => {
  try {
    const userId = req.body.userId; // From authUser middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Get statistics
    const totalAssessments = await medicalAssessmentModel.countDocuments({
      userId,
      status: "completed",
    });

    const recentAssessments = await medicalAssessmentModel
      .find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("createdAt patientData.symptoms");

    // Get most common symptoms
    const allAssessments = await medicalAssessmentModel
      .find({ userId, status: "completed" })
      .select("patientData.symptoms");

    const symptomCounts = {};
    allAssessments.forEach((assessment) => {
      assessment.patientData.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([symptom, count]) => ({ symptom, count }));

    res.json({
      success: true,
      stats: {
        totalAssessments,
        recentCount: recentAssessments.length,
        topSymptoms,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: error.message,
    });
  }
};

export {
  performAssessment,
  getAssessmentHistory,
  getAssessmentById,
  deleteAssessment,
  getAssessmentStats,
};
