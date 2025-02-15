// Set the Config
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// Utility
import connectDB from "./lib/connectDB.js";
// ROUTES
// 인증
import authRoutes from "../backend/routes/auth.route.js";
// 유저 (현재 로그인한 유저)
import userRoutes from "../backend/routes/user.route.js";
// 포스트
import postsRoutes from "../backend/routes/posts.route.js";
// 알람
import notificationRoutes from "./routes/notification.route.js";
// 친구요청
import connectionRoutes from "./routes/connections.route.js";

dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Restart/.env" });
const app = express();
// 미들웨어 설정해주기

app.use(express.json({ limit: "5mb" })); // parse JSON body Request
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const PORT = process.env.PORT || 5010;

// 인증(현재 로그인 유저) - ✅
app.use("/api/v1/auth", authRoutes);
// 유저 (현재 로그인)) - ✅
app.use("/api/v1/user", userRoutes);
// 포스팅 관련 라우터 - ✅
app.use("/api/v1/posts", postsRoutes);
// 알람 ( 인스타그램)- ✅
app.use("/api/v1/notifications", notificationRoutes);
// 친구 관리기능
app.use("/api/v1/connections", connectionRoutes);

app.listen(PORT, () => {
  console.info(`Server is Running ${PORT}`);
  connectDB();
});
