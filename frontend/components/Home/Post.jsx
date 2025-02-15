// External
import React from "react";
import {
  Trash2,
  LoaderCircle,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";
// Internal
import profilePic from "../../public/avatar.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../src/lib/axiosInstance";
import toast from "react-hot-toast";
import PostAction from "./PostAction";
const Post = ({ post, authUser }) => {
  const queryClient = useQueryClient();
  // Post 지워주는 Mutation
  const { mutate: deletePostMutation, isPending: isDeleteLoading } =
    useMutation({
      mutationFn: async (post) => {
        await axiosInstance.delete(`/posts/delete/${post._id}`);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
      onSuccess: () => {
        toast.success("Post Deleted Successfully");
      },
    });
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
              <p className="text-[10px]">Headline</p>
              <p className="text-[8px] text-gray-400">CreatedAt</p>
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
        {/* 댓글기능 / 좋아요 기능 */}
        {/* Focus */}
        <div className="flex justify-between px-4">
          <PostAction Icon={ThumbsUp} tag="like" />
          <PostAction Icon={MessageCircle} tag="comment" />
          <PostAction Icon={Share2} tag="share" />
        </div>
      </main>
    </div>
  );
};

export default Post;
