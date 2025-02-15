// Internal
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  House,
  UsersRound,
  Bell,
  UserRound,
  LogOut,
  AwardIcon,
} from "lucide-react";
// External
import logoSrc from "../../public/small-logo.png";
import { axiosInstance } from "../../src/lib/axiosInstance";
import toast from "react-hot-toast";

const Navbar = () => {
  const queryClient = useQueryClient();
  // Auth User
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // Logout function
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      toast.success("Loggout Successfully");
      queryClient.invalidateQueries({ queryKey: [] });
    },
    onError: (error) => {
      toast.error("Failed to logout", error?.resposne?.data?.message);
    },
  });

  // Fetch the notification
  const { data: notification } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notifications/getNotifications");
        // toast.success("Fetched the notifications successfully");
        return res.data;
      } catch (error) {
        console.error("Error in [Getting Notification]", error.message);
        // toast.error("Error in [Getting Notification]", error.message);
        return null;
      }
    },
    enabled: !!authUser,
  });
  // Fetch the connection Request
  const { data: connectionRequest } = useQuery({
    queryKey: ["connectionRequest"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/connections/requests");
        // toast.success("Fetched the connectionRequests Successfully");
        return res?.data?.requests;
      } catch (error) {
        console.error("Failed to fetch connectionRequests", error.message);
        toast.error("Failed to fetch connectionRequests", error.message);
      }
    },
    enabled: !!authUser,
  });
  // Length of Data
  const unreadNotification = notification?.filter(
    (noti) => noti.read !== true
  ).length;
  const unreadConnectionRequest = connectionRequest?.length;
  return (
    <div className=" max-h-10 shadow-lg shadow-cyan-500/50 flex w-screen justify-between items-center py-12 px-10 bg-amber-50">
      <img src={logoSrc} alt="Linkedin-logo" className="size-15 rounded-2xl" />
      {/* Icons */}
      {authUser ? (
        <div className="flex gap-x-5 mr-5 ">
          <Link to="/" className="flex flex-col items-center">
            <House />
            <span>Home</span>
          </Link>
          <Link to="/network" className="flex flex-col items-center relative">
            <div>
              <UsersRound />
              {connectionRequest?.length > 0 && (
                <span className="absolute size-5 bg-red-300 flex items-center justify-center rounded-full bottom-10 right-5  animate-pulse">
                  {unreadConnectionRequest}
                </span>
              )}
            </div>
            <span>My Network</span>
          </Link>
          <Link
            to="/notification"
            className="flex flex-col items-center relative"
          >
            <Bell />
            <span>Notification</span>
            {notification?.length > 0 && (
              <span className="absolute size-5 bg-red-300 flex items-center justify-center rounded-full bottom-10 right-5  animate-pulse">
                {unreadNotification}
              </span>
            )}
          </Link>
          <Link
            to={`/profile/${authUser.name}`}
            className="flex flex-col items-center"
          >
            <UserRound />
            <span>Me</span>
          </Link>
          <div className="flex flex-col items-center" onClick={logout}>
            <LogOut />
            <span>logout</span>
          </div>
        </div>
      ) : (
        <div className="flex gap-x-5 mr-5 ">
          <Link to="login">Login</Link>
          <Link to="signup">Sign Up</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
