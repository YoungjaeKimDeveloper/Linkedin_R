import React from "react";
const PostAction = ({ Icon, tag }) => {
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

  return (
    <button>
      <Icon className={`cursor-pointer stroke-blue-300 ${color(tag)}`} />
    </button>
  );
};

export default PostAction;
