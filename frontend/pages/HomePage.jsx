// External library
import React from "react";
import { useQuery } from "@tanstack/react-query";
// Internal Components
import Sidebar from "../components/Home/Sidebar";
import PostCreation from "../components/Home/PostCreation";
const HomePage = () => {
  // Authuser
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
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
      </div>
      {/* Recommended User */}
    </div>
  );
};

export default HomePage;
