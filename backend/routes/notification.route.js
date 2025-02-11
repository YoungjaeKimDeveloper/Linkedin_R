import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications,readNotification,deleteNotification } from "../controllers/notification.controller.js";
const router = express.Router();
// 가져오기
router.get("/getNotifications", protectRoute, getNotifications);
// 읽기
router.put("/:notificationId/read", protectRoute, readNotification);
// 지우기
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
