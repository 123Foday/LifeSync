import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import hospitalRouter from "./routes/hospitalRoute.js";
import medicalRouter from "./routes/medicalRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import emergencyRouter from "./routes/emergencyRoute.js";
import { startAppointmentScheduler } from "./utils/appointmentScheduler.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Connect to services
connectDB();
connectCloudinary();

// --- Production Middlewares ---
app.set('trust proxy', 1); // Trust first proxy (Railway/Vercel load balancer)
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // HTTP logging
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
  "https://life-sync-tau.vercel.app",  // frontend
  "https://amused-illumination-production.up.railway.app", // backend itself
  "http://localhost:5173", // local frontend
  "http://localhost:5174", // local admin
  "http://localhost:5175", // local mobile
  "http://127.0.0.1:5173", // local frontend (IP)
  "http://127.0.0.1:5174", // local admin (IP)
  "http://127.0.0.1:5175", // local mobile (IP)
];

const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // In development, allow all localhost and 127.0.0.1 origins
      if (isDevelopment) {
        const isLocalOrigin = origin.includes('localhost') || origin.includes('127.0.0.1');
        if (isLocalOrigin) {
          return callback(null, true);
        }
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- API Endpoints ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date(), uptime: process.uptime() });
});

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/hospital", hospitalRouter);
app.use("/api/medical", medicalRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/emergency", emergencyRouter);


app.get("/", (req, res) => {
  res.send("LifeSync API - Production Ready");
});

// --- Error Handling ---
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? "Internal Server Error" : err.message,
    errors: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  
  // Start the appointment scheduler for auto-cancelling overdue pending appointments
  startAppointmentScheduler();
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
