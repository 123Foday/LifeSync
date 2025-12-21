import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import hospitalRouter from "./routes/hospitalRoute.js";
import medicalRouter from "./routes/medicalRoute.js"; // ✅ NEW: Medical routes

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/hospital", hospitalRouter);
app.use("/api/medical", medicalRouter); // ✅ NEW: Medical advisory routes

app.get("/", (req, res) => {
  res.send("API WORKING - LifeSync with Medical Advisory");
});

app.listen(port, () => console.log("Server started", port));
