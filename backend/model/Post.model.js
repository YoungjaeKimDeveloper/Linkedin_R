import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    // 다른 Model Chaning
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    // comments && Likes
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          // Schema 에서 다른 모델을 참조해주면 Populate function 사용가능
          ref: "User",
        },
        content: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
