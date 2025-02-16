// Models
import Post from "../model/Post.model.js";
import User from "../model/User.model.js";
import Notification from "../model/notification.model.js";
// Utility
import cloudinary from "../lib/cloudinary.config.js";
import { sendCommentNotificationEmail } from "../emails/emailHandler.js";
// 현재유저 + 친구 포스트 가져오기
export const getFeedPosts = async (req, res) => {
  try {
    // author 기준 Post
    const posts = await Post.find({
      author: {
        $in: [...req.user.connections, req.user._id],
      },
    })
      //  포스트 불러올때 관련 정보 같이 가져오기
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name username profilePicture")
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
// 포스트 작성하기
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
    // 권한 확인하기
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
    const content = req.body.comment;
    console.log("전달받은 commnet", content);
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user.id, content: content } },
      },
      // 기존 Document 업데이트 후 에 받게됨
      { new: true }
      // For the email?
    ).populate("author", "name email username headline profilePicture");
    // console.log("-T- UserID : ", req.user?.id);
    // console.log("-T- postAuthor : ", post?.author);
    console.info("function이 울립니다");
    // Create the notification for the user
    if (req.user.id.toString() !== post.author._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        relatedUser: req.user._id,
        relatedPost: postId,
        type: "comment",
      });

      await notification.save();
      // todo - send Email
      try {
        const postUrl = process.env.CLIENT_URL + "/post/" + postId;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.error(
          "Error in sending comment notification email",
          error.message
        );
      }
      return res.status(200).json(post);
    }
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error in createComment controller", error.message);
    return res.status(500).json({
      success: false,
      message: `Error in createComment controller : ${error.message}`,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userid = req.user.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the Post" });
    }
    // 싫어요(이미 좋아요가 있는경우)
    if (post.likes.includes(userid)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userid.toString()
      );
    } else {
      // 좋아요
      post.likes.push(userid);
    }
    // notification 으로 남겨주기
    // 글 작성한 주인에게 Like 달렸다고 Notification 전달해주기
    if (req.user.id.toString() !== post.author.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        relatedUser: userid,
        relatedPost: postId,
        type: "like",
      });
      await newNotification.save();
    }

    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Liked function works successfully" });
  } catch (error) {
    console.error("Server Error in [likePost]", error.message);
    return res.status(500).json({
      success: false,
      message: `Server Error in [likePost] ${error.message}`,
    });
  }
};
