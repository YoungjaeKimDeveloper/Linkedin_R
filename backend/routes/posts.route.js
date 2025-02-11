import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from "../controllers/post.controller.js";
const router = express.Router();

// 포스트 가져오는 Route
router.get("/", protectRoute, getFeedPosts);
// 포스터 만들어주기
router.post("/create", protectRoute, createPost);
// id찾아서 Post지워주기
router.delete("/delete/:postId", protectRoute, deletePost);
// Signle Post 가져오기
router.get("/:postId", protectRoute, getPostById);

// Like && Comments
// Id로 Post찾아서 comment 달아주기
router.post("/:postId/comment", protectRoute, createComment);
// Id로 Post찾아서 comment달아주기
router.post("/:postId/like", protectRoute, likePost);

export default router;
