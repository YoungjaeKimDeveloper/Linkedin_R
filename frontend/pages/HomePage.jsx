// External library
import React from "react";
import { useQuery } from "@tanstack/react-query";
// Internal Components
import Sidebar from "../components/Home/Sidebar";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <div className="bg-blue-50 min-h-screen min-w-screen grid grid-col-1 lg:grid-cols-3 px-10 py-4">
      <Sidebar authUser={authUser} />
      {/* MAIN POST PART */}
      {/* Recommended User */}
    </div>
  );
};

export default HomePage;
