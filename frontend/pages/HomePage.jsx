import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../src/lib/axiosInstance";
import toast from "react-hot-toast";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { mutate: loggout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      toast.success("User logged out");
      // queryClient.setQueryData(["authUser"], null);
      // queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error("Failed to logout", error.message);
    },
  });
  return <div></div>;
};

export default HomePage;
