// Models
import Post from "../model/Post.model.js";
import User from "../model/User.model.js";
import Notification from "../model/notification.model.js";
// Utility
import cloudinary from "../lib/cloudinary.config.js";

export const getFeedPosts = async (req, res) => {
  try {
    // FeedsPost를 불러올땐 author 기준으로 불러와야한다.
    const posts = await Post.find({
      author: {
        $in: [...req.user.connections, req.user._id],
      },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.erorr("ERROR IN [getFeedPosts]", error.message);
    return res.status(404).json({
      success: false,
      message: `ERROR IN [getFeedPosts] ,${error.message}`,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    // Post만들기 + Comments / Likes 따로
    const { content, image } = req.body;
    let imageURL;
    let newPost;
    // 이미지가 있는 경우
    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image);
        imageURL = result.secure_url;
        newPost = new Post({ author: req.user.id, content, image: imageURL });
      } catch (error) {
        console.error("Failed to upload Image", error.message);
      }
      // 이미지가 없는경우
    } else {
      newPost = new Post({ author: req.user.id, content });
    }

    await newPost.save();
    return res
      .status(201)
      .json({ success: true, message: "New Post has been created", newPost });
  } catch (error) {
    console.error("Failed to create new Post", error.message);
    return res.status(401).json({
      success: false,
      message: `Failed to create new Post : ${error.message}`,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postID = req.params.postId;
    const userID = req.user.id;

    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the post" });
    }

    if (userID.toString() !== post.author.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Anauthorized user" });
    }

    // Cloudinary 에서 지워주기
    if (post.image) {
      try {
        await cloudinary.uploader.destroy(
          post.image.split("/").pop().split(".")[0]
        );
        console.log("IMAGE DELETED✅");
      } catch (error) {
        console.error("Failed to delete image from cloudinary", error.message);
      }
    }
    await Post.findByIdAndDelete(postID);
    return res.status(200).json({ success: true, message: "Post Deleted ✅" });
    // Cloudinary 에서 지워주기
  } catch (error) {
    console.error("Failed to delete Post", error.messages);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [deletePost],${error.message}`,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "profilePicture username headline");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Canoot find the post" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getPostById ${error.message}`,
    });
  }
};
// Notification 달아주기 
export const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    // 실제 유저가 작성한 content
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
      // ? 이 부분 잘이해안됨
    ).populate("author", "name email username headline profilePicture");
    // Create the notification for the user
    const notification = new Notification();
  } catch (error) {}
};

export const likePost = async (req, res) => {
  try {
  } catch (error) {}
};
