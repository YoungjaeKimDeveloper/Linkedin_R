// Set the Config
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// Utility
import connectDB from "./lib/connectDB.js";
// ROUTES
import authRoutes from "../backend/routes/auth.route.js";
import userRoutes from "../backend/routes/user.route.js";
import postsRoutes from "../backend/routes/posts.route.js";

dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Restart/.env" });
const app = express();
// 미들웨어 설정해주기

app.use(express.json({ limit: "5mb" })); // parse JSON body Request
app.use(cookieParser());
const PORT = process.env.PORT || 5010;
// Setting the routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/posts", postsRoutes);

app.listen(PORT, () => {
  console.info(`Server is Running ${PORT}`);
  connectDB();
});
