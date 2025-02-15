import React from "react";
// External
import { House, Users, BellDot } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// Internal
import bannerImg from "../../public/banner.png";
import userProfileImg from "../../public/avatar.png";

const Sidebar = ({ authUser }) => {
  console.log("Auth User: ", authUser);
  const numberOfConnections = authUser.connections.length;
  return (
    <div className=" max-w-60  border-black border-solid max-h-100 rounded-xl shadow-2xl shadow-black border-2 bg-gray-50 ">
      <div contextMenu="flex flex-col items-center border-black !shadow-2xl">
        {/* Top Profile */}
        <div className="relative z-10">
          <img
            src={authUser.bannerImg || bannerImg}
            alt="bannerImg"
            className="absolute z-10 rounded-t-lg"
          />
          <div className="z-10 relative flex flex-col items-center  justify-center text-center gap-y-2">
            <img
              src={authUser.profilePicture || userProfileImg}
              alt="user_profile_img"
              className="z-100  w-[100px] !h-[100px] rounded-full mt-5 "
            />
            <p className="text-xl font-bold">{authUser.name}</p>
            <p className="text-sm">{authUser.headline}</p>
            <p className="text-gray-500 font-bold text-sm">
              {numberOfConnections}{" "}
              {numberOfConnections <= 1 ? "connection" : "connections"}
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-col itmes-cen justify-center gap-y-4 mt-5 text-center">
          <Link to="/" className="profile-links">
            <House />
            <p className="profile-font">Home</p>
          </Link>
          <Link to="/network" className="profile-links">
            <Users />
            <p className="profile-font">My Network</p>
          </Link>
          <Link to="/notification" className="profile-links">
            <BellDot />
            <p className="profile-font">Notifications</p>
          </Link>
          {/* Link for Profile */}
          <Link to={`/profile/${authUser.name}`}>
            <p>View Profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
