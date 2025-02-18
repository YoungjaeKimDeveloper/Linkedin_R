import React from "react";

const ShowComment = ({ comment }) => {
  return (
    <div>
      <div className="bg-gray-300 rounded-2xl mt-4">
        <div className="p-2 flex items-center gap-x-2">
          <img
            src="../../public/avatar.png"
            alt="user_profile"
            className="size-10"
          />
          <div className="mt-2">
            <p className="font-bold">{comment?.user?.username}</p>
            <p className="font-bold">{comment?.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowComment;
