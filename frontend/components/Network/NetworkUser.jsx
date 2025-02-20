import React from "react";
// Internal
import avatar from "../../public/avatar.png";
import NormalBTN from "./NormalBTN";
const NetworkUser = ({ username, profilePic, onClick }) => {
  console.log("USERNAME", username);
  console.log("PROFILEPIc", profilePic);

  return (
    <div className="w-full p-2 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <img
            src={profilePic ? profilePic : avatar}
            alt="profile_img"
            className="size-10"
          />
          <div>
            <p className="font-bold">{username}</p>
            <p className="text-gray-500">Linkedin User</p>
          </div>
        </div>
        <div className=" flex gap-x-4 ">
          <NormalBTN onClick={onClick} text="Accept" style={"bg-blue-500"} />
          <NormalBTN text="Reject" style={"bg-red-500"} />
        </div>
      </div>
    </div>
  );
};

export default NetworkUser;
