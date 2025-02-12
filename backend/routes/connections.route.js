import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../controllers/connection.controller.js";
const router = express.Router();
// 친구추가 요청 보내기
router.post("/request/:userId", protectRoute, sendConnectionRequest);
// 친구 요청 받아주기
router.put("/accpet/:requestId", protectRoute, acceptConnectionRequest);
// 친구 요청 거절하기
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);
// 받은 전체 요청 가져오기 (로그인 한 유저)
// router.get("/requests", protectRoute, getConnectionRequests);
// // 친구목록 전체 불러오기
// router.get("/", protectRoute, getUserConnections);
// // 친구목록에서 친구 지우기

// router.delete("/userId", protectRoute, removeConnection);
// // 보낸요청상태 확인 해주기
// router.get("/status/:userId", protectRoute, getConnectionsStatus);

export default router;
