// External
import React from "react";
import { Trash2 } from "lucide-react";
// Internal
import profilePic from "../../public/avatar.png";
import postImg from "../../public/screenshot-for-readme.png";
const Post = ({ post, authUser }) => {
  console.log("AUTHUSER !!", authUser?._id);
  console.log("POST", post?.author?._id);
  console.log(authUser?._id == post?.author?._id);
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
            <button>
              <Trash2 className="stroke-red-300 hover:stroke-red-500 cursor-pointer duration-500" />
            </button>
          )}
        </div>
        <p className="font-serif py-2 ml-2">{post?.content}</p>
        {post?.image && (
          <img src={post?.image} alt="post_img" className="p-4 rounded-4xl" />
        )}
      </main>
    </div>
  );
};

export default Post;
