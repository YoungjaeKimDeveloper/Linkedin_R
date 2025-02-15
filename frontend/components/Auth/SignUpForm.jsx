import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
// Utility
import { axiosInstance } from "../../src/lib/axiosInstance";
import toast from "react-hot-toast";

import { LoaderCircle } from "lucide-react";

const SignUpForm = () => {
  const queryClient = useQueryClient();
  // 기본적으로 받아와야할 정보
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  // Signup 해서 서버로 보내주기 [Mutation Function에서는 항상 Mutation으로 끝내주기]
  const { mutate: signUpMutation, isLoading: loginLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Signed up Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      resetForm();
    },
    onError: (error) => {
      console.error("Error in [signUpMutation]", error);
      toast.error("Failed to Signup", error?.response?.data?.message);
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };
  const resetForm = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
  };
  return (
    <div className="w-full ">
      <form
        className="flex items-center justify-center flex-col gap-y-4 "
        onSubmit={handleSignup}
      >
        <input
          className=" input-bordered w-full max-w-xs bg-green-200  h-10 rounded-xl text-2xl "
          placeholder="name"
          value={name}
          required
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className=" input-bordered w-full max-w-xs bg-green-100  h-10 rounded-xl py-2"
          placeholder="username"
          value={username}
          required
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className=" input-bordered w-full max-w-xs bg-green-100  h-10 rounded-xl py-2"
          placeholder="email"
          value={email}
          required
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className=" input-bordered w-full max-w-xs bg-green-100  h-10 rounded-xl py-2"
          placeholder="password"
          value={password}
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-green-200" disabled={loginLoading}>
          {loginLoading ? (
            <LoaderCircle className="animate-spin" size={35} />
          ) : (
            <p className="text-2xl bg-red-200 p-2 rounded-2xl text-white cursor-pointer">
              Sign Up
            </p>
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
