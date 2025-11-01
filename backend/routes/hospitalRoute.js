// Duplicate doctorRoute.js
import express from "express";
import {
  hospitalList,
  loginHospital,
  getHospitalAppointments,
  appointmentComplete,
  appointmentCancel,
  hospitalDashboard,
  getHospitalProfile,
  updateHospitalProfile,
} from "../controllers/hospitalController.js";

import authHospital from "../middlewares/authHospital.js";

const hospitalRouter = express.Router();

hospitalRouter.get("/list", hospitalList);
hospitalRouter.post("/login", loginHospital);
hospitalRouter.get("/appointments", authHospital, getHospitalAppointments);
hospitalRouter.post("/complete-appointment", authHospital, appointmentComplete);
hospitalRouter.post("/cancel-appointment", authHospital, appointmentCancel);
hospitalRouter.get("/dashboard", authHospital, hospitalDashboard);
hospitalRouter.get("/profile", authHospital, getHospitalProfile);
hospitalRouter.post(
  "/update-profile",
  authHospital,
  updateHospitalProfile
);

export default hospitalRouter;
