import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();
// 유저 suggestions
router.get("/suggestions", protectRoute, getSuggestedConnections);
// 개인 Public Profile
router.get("/:username", protectRoute, getPublicProfile);
// profile -Edit
router.put("/profile", protectRoute, updateProfile);

export default router;
