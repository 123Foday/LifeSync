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
  getHospitalDoctors,
  addDoctorToHospital,
  removeDoctorFromHospital,
  hospitalAddDoctor,
} from "../controllers/hospitalController.js";
import authHospital from "../middlewares/authHospital.js";
import upload from "../middlewares/multer.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const hospitalRouter = express.Router();

// Public route - Get list of all hospitals
hospitalRouter.get("/list", hospitalList);

// Authentication route
hospitalRouter.post("/login", loginLimiter, loginHospital);

// Protected routes - require authentication
hospitalRouter.get("/appointments", authHospital, appointmentsHospital);
hospitalRouter.post("/complete-appointment", authHospital, appointmentComplete);
hospitalRouter.post("/cancel-appointment", authHospital, appointmentCancel);
hospitalRouter.get("/dashboard", authHospital, hospitalDashboard);
hospitalRouter.get("/profile", authHospital, hospitalProfile);
hospitalRouter.post("/update-profile", authHospital, updateHospitalProfile);
hospitalRouter.post("/add-doctor", authHospital, addDoctorToHospital);
hospitalRouter.post("/remove-doctor", authHospital, removeDoctorFromHospital);
hospitalRouter.get("/doctors", authHospital, getHospitalDoctors);
// allow hospital to create a new doctor via multipart/form-data
hospitalRouter.post("/create-doctor", authHospital, upload.single('image'), hospitalAddDoctor);

export default hospitalRouter;
