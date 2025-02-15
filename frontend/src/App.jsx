import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Home, Loader, Network } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Utility
import Layout from "../components/layout/Layout";
import { axiosInstance } from "./lib/axiosInstance.js";
// App,jsx : 메인 컴토넌트
// Pages
import HomePage from "../pages/HomePage.jsx";
import SignUpPage from "../pages/Auth/SignUpPage.jsx";
import LoginPage from "../pages/Auth/LoginPage.jsx";
import NetworkPage from "../pages/NetworkPage.jsx";
import NotificationPage from "../pages/NotificationPage.jsx";
import PostPage from "../pages/PostPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";

// Auth user check

const App = () => {
  // useQuery는 항상 데이터 반환해주어야함
  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        // 반환되는값이 authUser
        return res.data;
        // Unauthorized ERRRO 예상해서 AuthUser 풀어줘야함
      } catch (error) {
        toast.error(`Update authUer Error ${error?.response?.data?.message}`);
        if (error.response && error.response.status === 401) {
          return null;
        }
      }
    },
  });
  // 로딩시 화면
  console.log("-T: authUser", authUser);
  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notification"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        {/* Post*/}
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        {/* Profile 파라미터로 동적인것 받아주기 */}
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
