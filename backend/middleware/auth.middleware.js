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
    // decoded - Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // middleware에서 다시 req.user = user로 내보내 주기
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
