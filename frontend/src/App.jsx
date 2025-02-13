import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
// App,jsx : 메인 컴토넌트
// Pages
import HomePage from "../pages/HomePage.jsx";
import SignUpPage from "../pages/Auth/SignUpPage.jsx";
import LoginPage from "../pages/Auth/LoginPage.jsx";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
