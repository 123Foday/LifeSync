import express from "express";
import {
  performAssessment,
  getAssessmentHistory,
  getAssessmentById,
  deleteAssessment,
  getAssessmentStats,
} from "../controllers/medicalController.js";
import authUser from "../middlewares/authUser.js";

const medicalRouter = express.Router();

// All routes require authentication
// authUser middleware adds userId to req.body

/**
 * POST /api/medical/assess
 * Perform a new medical assessment
 * Body: { age, gender, symptoms[] }
 */
medicalRouter.post("/assess", authUser, performAssessment);

/**
 * GET /api/medical/history
 * Get user's assessment history (last 50)
 */
medicalRouter.get("/history", authUser, getAssessmentHistory);

/**
 * GET /api/medical/assessment/:id
 * Get specific assessment by ID
 */
medicalRouter.get("/assessment/:id", authUser, getAssessmentById);

/**
 * DELETE /api/medical/assessment/:id
 * Delete an assessment
 */
medicalRouter.delete("/assessment/:id", authUser, deleteAssessment);

/**
 * GET /api/medical/stats
 * Get assessment statistics for user
 */
medicalRouter.get("/stats", authUser, getAssessmentStats);

export default medicalRouter;
