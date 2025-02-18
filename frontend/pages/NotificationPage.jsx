import { useQuery } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../src/lib/axiosInstance";
import toast from "react-hot-toast";

const NotificationPage = () => {
  // grap notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        toast.success("Fetched the notifications successfully");
        const res = await axiosInstance.get("/notifications/getNotifications");
        return res?.data;
      } catch (error) {
        console.error("ERROR IN [Fetching notifications]", error);
        toast.error("ERROR IN [Fetching notifications]");
      }
    },
  });
  // TESTING ZONE[S]
  console.log(notifications);
  // TESTING ZONE[E]

  return <div>NotificationPage</div>;
};

export default NotificationPage;
