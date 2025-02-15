// External library
import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
// Components
import Sidebar from "../components/Home/Sidebar";
import PostCreation from "../components/Home/PostCreation";
import Post from "../components/Home/Post";
// Utility
import { axiosInstance } from "../src/lib/axiosInstance";
const HomePage = () => {
  // Authuser
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        toast.success("Fetched the posts Successfully ✅");
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
  console.log("-T POSTS: ", posts);
  console.log("AUTHUSER", authUser);
  console.log("POSTS", posts);
  return (
    <div className="bg-blue-50 min-h-screen min-w-screen grid grid-col-1 lg:grid-cols-3 px-10 py-4">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar authUser={authUser} />
      </div>
      {/* Main Post 부분 */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        {/* 포스트 만들어주기 */}
        <PostCreation authUser={authUser} />
        {/* 포스트 불러와주기 */}
        {/* {posts?.length > 0 && posts?.map((post) => <div>{post.content}</div>)} */}
        {posts?.map((post) => (
          <Post post={post} key={post._id} authUser={authUser} />
        ))}
      </div>
      {/* Recommended User */}
    </div>
  );
};

export default HomePage;
