// Settings
import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
// ROUTES
import authRoutes from "../backend/routes/auth.route.js";
import cookieParser from "cookie-parser";
// Set the Config
dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Restart/.env" });

// 미들웨어 설정해주기
const app = express();
app.use(express.json({ limit: "5mb" })); // parse JSON body Request
app.use(cookieParser());
const PORT = process.env.PORT || 5010;

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`);
  connectDB();
});
