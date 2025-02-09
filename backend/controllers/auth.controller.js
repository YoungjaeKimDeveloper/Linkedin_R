import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    // 비밀번호 해쉬
    const hashedPassword = await bcrypt.hash(password, salt);

    // 유저 만들때 해쉬된 유저 비밀번호로 만들어주기
    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await user.save();
    // Verify - Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    // Token - cookie
    res.cookie("jwt-linkedin", token, {
      httpOnly: true, // prevent XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // prevent CSRF attacks,
      secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
    });

    res.status(201).json({ message: "User registered successfully" });
    // Mail Trap Part
    // 나중에 Routes만들어서 연결될 프로파일 만들어주는거임
    const profileURL = process.env.CLIENT_URL + "/profile/" + user.username;
    try {
      // 방금 만들어진 유저 정보로 email 작성해주기
      await sendWelcomeEmail(user.email, user.name, profileURL);
    } catch (error) {
      console.error("Error in sending welcome email: ", error.message);
    }
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    // 유저 아이디와 이름으로 User찾기
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 쿠키통에 TOKEN담아주기
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    await res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
