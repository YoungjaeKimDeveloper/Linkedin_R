import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 요청보내온 쿠키통에서 "jwt-linkedin" 토큰 꺼내오기
    const token = req.cookies["jwt-linkedin"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    // 발행해준 토큰 decode 해주기
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 찾지못한경우 
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    // docode할때 넣었던 Key값으로 찾아주기
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // 인증후 -> 미들웨어에서 다시 보내주기
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
