// External library
import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Handshake, X } from "lucide-react";
// Components
import Sidebar from "../components/Home/Sidebar";
import PostCreation from "../components/Home/PostCreation";
import Post from "../components/Home/Post";
// Utility
import { axiosInstance } from "../src/lib/axiosInstance";
// Image
import avatar from "../public/avatar.png";
const HomePage = () => {
  // Authuser
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        return res?.data.posts;
      } catch (error) {
        console.error(
          "ERROR IN [Fetching POSTS]",
          error?.response?.data?.message
        );
        toast.error(
          `FAILED TO FETCHED THE POSTS ${error?.response?.data?.message}`
        );
      }
    },
  });
  // TESTER - ZONE

  return (
    <div className="bg-blue-50 min-h-screen min-w-screen grid grid-col-1 lg:grid-cols-4 px-10 py-4">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar authUser={authUser} />
      </div>
      {/* Main Post 부분 */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        {/* 포스트 만들어주기 */}
        <PostCreation authUser={authUser} />
        {posts?.map((post) => (
          <Post post={post} key={post._id} authUser={authUser} />
        ))}
      </div>
      <div className="hidden col-span-1 lg:col-span-1 lg:block bg-gray-200 max-h-60 rounded-2xl">
        <div className="px-4 flex flex-col justify-center gap-y-5 w-full  h-full">
          {/* Individual User */}
          <div className="flex justify-between items-center bg-blue">
            <div className="flex items-center">
              <img src={avatar} alt="vatar" className="size-10 mr-2" />
              <div>
                <p className="text-sm text-gray-500">userName</p>
                <p className="text-sm text-gray-400">headline</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <button className="bg-blue-400 p-2 rounded-full !hover:cursor-pointer">
                <Handshake size={15} className="stroke-white" />
              </button>
              <button className="bg-red-400 p-2 rounded-full">
                <X size={15} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-blue">
            <div className="flex items-center">
              <img src={avatar} alt="vatar" className="size-10 mr-2" />
              <div>
                <p className="text-sm text-gray-500">userName</p>
                <p className="text-sm text-gray-400">headline</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <button className="bg-blue-400 p-2 rounded-full !hover:cursor-pointer">
                <Handshake size={15} className="stroke-white" />
              </button>
              <button className="bg-red-400 p-2 rounded-full">
                <X size={15} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-blue">
            <div className="flex items-center">
              <img src={avatar} alt="vatar" className="size-10 mr-2" />
              <div>
                <p className="text-sm text-gray-500">userName</p>
                <p className="text-sm text-gray-400">headline</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <button className="bg-blue-400 p-2 rounded-full !hover:cursor-pointer">
                <Handshake size={15} className="stroke-white" />
              </button>
              <button className="bg-red-400 p-2 rounded-full">
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
