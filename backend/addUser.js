import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/userModel.js"; // adjust path if needed

dotenv.config(); // loads .env file (make sure MONGO_URI is there)

const addUser = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // 2️⃣ Define user details
    const userData = {
      name: "dtso Kai",
      email: "dtso.cbc.sl.com",
      password: "112001kai", // plain password (will be hashed below)
      gender: "Male",
      dob: "2002-07-12",
       address: {
        line1: "Makeni City",
        line2: "Bombali District, Sierra Leone",
      },
      phone: "+23270000000",
      image: "",
    };

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 4️⃣ Create user
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    // 5️⃣ Save user
    await newUser.save();
    console.log("🎉 User added successfully:", newUser);

    process.exit();
  } catch (error) {
    console.error("❌ Error adding user:", error.message);
    process.exit(1);
  }
};

addUser();