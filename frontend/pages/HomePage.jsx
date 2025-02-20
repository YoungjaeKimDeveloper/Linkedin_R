// External library
import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Handshake, X } from "lucide-react";
// Components
import Sidebar from "../components/Home/Sidebar";
import PostCreation from "../components/Home/PostCreation";
import Post from "../components/Home/Post";
import RecommendedUser from "../components/Home/RecommendedUser";
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
        // toast.error(
        //   `FAILED TO FETCHED THE POSTS ${error?.response?.data?.message}`
        // );
      }
    },
    enabled: !!authUser,
  });
  // fetch Recommended User
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/suggestions");
        return res?.data;
      } catch (error) {
        console.error("ERROR IN fetching [recommendedUser] ", error?.message);
        // toast.error(`ERROR IN fetching [recommendedUser] ${error?.message}`);
      }
    },
    enabled: !!authUser,
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
        <div className="px-4 flex flex-col justify-center gap-y-5 w-full  h-full items-center">
          {/* Individual User */}
          {recommendedUsers?.length == 0 ? (
            <div>
              <p className="font-bold">No recommendedUsers</p>
            </div>
          ) : (
            <div className="py-4 w-full h-full">
              {recommendedUsers?.map((recommendedUser) => (
                <RecommendedUser
                  key={recommendedUser._id}
                  recommendedUser={recommendedUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// 항상 map으로 뿌려주기 전에 Layout 짜주고 만들어주기
