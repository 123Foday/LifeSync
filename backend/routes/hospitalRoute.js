import express from "express";
import {
  hospitalList,
  loginHospital,
  appointmentsHospital,
  appointmentComplete,
  appointmentCancel,
  hospitalDashboard,
  hospitalProfile,
  updateHospitalProfile,
} from "../controllers/hospitalController.js";
import authHospital from "../middlewares/authHospital.js";

const hospitalRouter = express.Router();

// Public route - Get list of all hospitals
hospitalRouter.get("/list", hospitalList);

// Authentication route
hospitalRouter.post("/login", loginHospital);

// Protected routes - require authentication
hospitalRouter.get("/appointments", authHospital, appointmentsHospital);
hospitalRouter.post("/complete-appointment", authHospital, appointmentComplete);
hospitalRouter.post("/cancel-appointment", authHospital, appointmentCancel);
hospitalRouter.get("/dashboard", authHospital, hospitalDashboard);
hospitalRouter.get("/profile", authHospital, hospitalProfile);
hospitalRouter.post("/update-profile", authHospital, updateHospitalProfile);

export default hospitalRouter;
