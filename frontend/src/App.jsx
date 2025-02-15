import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Home, Loader } from "lucide-react";
// Utility
import Layout from "../components/layout/Layout";
import { axiosInstance } from "./lib/axiosInstance.js";
// App,jsx : 메인 컴토넌트
// Pages
import HomePage from "../pages/HomePage.jsx";
import SignUpPage from "../pages/Auth/SignUpPage.jsx";
import LoginPage from "../pages/Auth/LoginPage.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
          path="login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
