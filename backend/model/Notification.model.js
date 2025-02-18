import mongoose from "mongoose";
// For the notification Page
const notificationSchema = new mongoose.Schema({
  // Notification 받는사람
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Sender User
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // POST는 선택사항
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  // 받는이유
  type: {
    type: String,
    required: true,
    enum: ["like", "comment", "connectionAccepted"],
  },
  // 사용자가 읽고 나중에 UI 반영될수있게
  read: {
    type: Boolean,
    default: false,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
