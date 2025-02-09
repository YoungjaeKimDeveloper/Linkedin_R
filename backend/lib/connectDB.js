import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.info("DB CONNECTED ✅");
  } catch (error) {
    console.error("Failed to connect DB", error.message);
    process.exit(1);
  }
};

export default connectDB;
