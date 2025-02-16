// External
import React, { useState } from "react";
import {
  Trash2,
  LoaderCircle,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
// Internal
import profilePic from "../../public/avatar.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../src/lib/axiosInstance";
import toast from "react-hot-toast";
import PostAction from "./PostAction";
import CreateComments from "./ShowComment";
import ShowComment from "./ShowComment";

const Post = ({ post, authUser }) => {
  const queryClient = useQueryClient();
  // Post 지워주는 Mutation
  const { mutate: deletePostMutation, isPending: isDeleteLoading } =
    useMutation({
      mutationFn: async (post) => {
        await axiosInstance.delete(`/posts/delete/${post._id}`);
      },
      onSuccess: () => {
        toast.success("Post Deleted Successfully");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  // Like Post Mutation
  const { mutate: likePostMutation } = useMutation({
    mutationFn: async () => {
      // 호출 되기만 하면 Like가 추가됨
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      // toast.success("Liked✅");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("ERROR IN [likePost]", error);
      toast.error(`ERROR IN [likePost], ${error?.response?.data?.messag}`);
    },
  });
  // Create Comment Mutation
  const { mutate: createCommentMutation, isPending: isCommentLoading } =
    useMutation({
      mutationFn: async (comment) => {
        console.log("전달되는 코멘트", comment);
        await axiosInstance.post(`/posts/${post._id}/comment`, { comment });
      },
      onSuccess: () => {
        toast.success("Comment has been created successfully");
        console.log("댓글달기완료");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setShowComments(true);
        setComment("");
      },
      onError: (error) => {
        console.error("ERROR IN [createCommentMutation]", error);
        toast.error(`ERROR IN [createCommentMutation] ${error}`);
      },
      onSettled: () => {
        console.error("끝");
      },
    });
  // - Variables -
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const isLiked = post?.likes?.includes(authUser._id);
  const handleShowComment = () => {
    setShowComments((prev) => !prev);
  };
  // Date Foramt
  const startDate = new Date(post?.createdAt);
  const distance = formatDistanceToNow(startDate, { addSuffix: true });
  const handleCreateComment = (e) => {
    console.log("h");
    e.preventDefault();
    createCommentMutation(comment);
  };
  // Testing Zone

  return (
    <div className="bg-gray-200 max-w-[700px] rounded-2xl mt-20 shadow-2xl">
      <main className="p-4 text-left">
        {/* Top */}
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-x-2">
            <img
              src={post.author.profilePicture || profilePic}
              alt="profile_Pic"
              className="size-10 rounded-full"
            />
            <div>
              <p className="text-sm font-bold">{post?.author.username}</p>
              <p className="text-[10px]">{post?.authUser?.headline}</p>
              <p className="text-[10px] text-gray-400">{distance}</p>
            </div>
          </div>
          {authUser?._id == post?.author?._id && (
            <button
              onClick={() => deletePostMutation(post)}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin stroke-red-300 hover:stroke-red-500 cursor-pointer duration-500"
                />
              ) : (
                <Trash2 className="stroke-red-300 hover:stroke-red-500 cursor-pointer duration-500" />
              )}
            </button>
          )}
        </div>

        <p className="font-serif py-2 ml-2">{post?.content}</p>
        {post?.image && (
          <img src={post?.image} alt="post_img" className="p-4 rounded-4xl" />
        )}
        <div className="flex justify-between px-4">
          <PostAction
            Icon={ThumbsUp}
            tag="like"
            onClick={likePostMutation}
            isLiked={isLiked}
            length={post?.likes?.length}
          />
          <PostAction
            Icon={MessageCircle}
            tag="comment"
            onClick={handleShowComment}
            showComments={showComments}
            length={post?.comments?.length}
          />
          <PostAction Icon={Share2} tag="share" />
        </div>
        {/* show Comments */}

        {console.log("POST: ", post)}
        {showComments &&
          post?.comments?.map((comment) => <ShowComment comment={comment} />)}

        {/* Create new comment */}
        <form className="w-full mt-4" onSubmit={handleCreateComment}>
          <div className="flex items-center justify-center relative">
            <input
              type="text"
              className="w-[100%] rounded-2xl p-2 border-gray-50"
              placeholder="Comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute right-0"
              disabled={isCommentLoading}
            >
              {isCommentLoading ? (
                <div className="share-btn size-10 ">
                  <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                <Send className="share-btn size-10" />
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Post;
