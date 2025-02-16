import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../src/lib/axiosInstance";
import toast from "react-hot-toast";
const PostAction = ({
  Icon,
  tag,
  post,
  onClick,
  isLiked,
  showComments,
  length,
}) => {
  let style = "";
  let commentStyle = "";
  let color = (tag) => {
    switch (tag) {
      case "like":
        return "stroke-blue-500";
      case "comment":
        return "stroke-green-500";
      case "share":
        return "stroke-red-500";
      default:
        return "";
    }
  };
  if (isLiked) {
    style = "fill-blue-300";
  }
  if (showComments) {
    commentStyle = "fill-green-300";
  }
  // Testing Zone

  return (
    <button
      className="flex items-center gap-x-1 cursor-pointer"
      onClick={onClick}
    >
      <Icon
        className={`cursor-pointer  ${color(tag)} ${style} ${commentStyle}`}
      />
      <span className="font-bold">{length}</span>
    </button>
  );
};

export default PostAction;
