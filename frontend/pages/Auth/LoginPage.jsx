// External Library
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// Utility
import { axiosInstance } from "../../src/lib/axiosInstance";

// JSX
const LoginPage = () => {
  // Mutation Client
  const queryClient = useQueryClient();
  // Track the Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Login Mutation
  const { mutate: loginMutation } = useMutation({
    mutationFn: async (data) => {
      await axiosInstance.post("/auth/login", data);
    },
    onSuccess: () => {
      toast.success("User Loggined");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(`Failed in [loginMutation] ${error.message}`);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };
  return (
    <div className="mx-auto flex itmes-cen justify-center">
      <div className="w-1/2 h-1/2 mt-20 flex flex-col items-center justify-center gap-y-4">
        <h2>Login Today</h2>
        <form className="flex flex-col gap-y-4" onSubmit={handleLogin}>
          <div className="p-4 bg-blue-50 w-full rounded-xl">
            <input
              type="text"
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="p-4 bg-blue-50 w-full rounded-xl">
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="bg-blue-200 text-center rounded-2xl">
            <button type="submit" className="bg-blue-400 w-20 h-20">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
