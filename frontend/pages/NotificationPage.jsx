// External
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ThumbsUp,
  UserPlus,
  MessageSquare,
  User,
  Trash2,
  UserSquare,
  Eye,
} from "lucide-react";

// Internal
import { axiosInstance } from "../src/lib/axiosInstance";
import { formatDistanceToNow } from "date-fns";

const NotificationPage = () => {
  // notification 불러오기
  const { data: notifications, isLoading: isFetchingNotification } = useQuery({
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
  // Testing
  console.log(notifications);
  // notification 읽기
  const { mutate: readNotificationMutation, isPending: isReadNotification } =
    useMutation({
      mutationFn: async (notificationId) => {
        await axiosInstance.put(`/notifications/${notificationId}/read`);
      },
      onSuccess: () => {
        toast.success("Read the notification successfully");
      },
      onError: (error) => {
        console.log("ERROR IN [readNotificationMutation]", error);
        toast.error("ERROR IN [readNotificationMutation]");
      },
    });
  // Notification 지워주기
  const { mutate: deleteNotification, isPending: isDeleteLoading } =
    useMutation({
      mutationFn: async (notificationId) => {
        await axiosInstance.delete(`/${notificationId}`);
      },
      onSuccess: () => {
        toast.success("Notification deleted successfully");
      },
      onError: (error) => {
        console.error("ERROR IN [deleteNotification]", error);
        toast.error("ERROR IN [deleteNotification");
      },
    });

  const renderNotification = (notification) => {
    switch (notification?.type) {
      case "like": {
        return (
          <div className="border rounded-xl p-4 border-solid border-black flex items-center bg-yellow-50 max-w-full">
            <div className="flex items-start gap-x-4 w-full">
              <img
                src="../public/avatar.png"
                alt="profile_img"
                className="size-10"
              />
              {/* Details */}
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <ThumbsUp className="stroke-blue-500 stroke-3" />
                    <p className="font-bold">
                      {notification?.relatedUser?.username}
                    </p>
                    <p>commented on your post</p>
                  </div>
                  <span className="text-gray-500">
                    {notification?.createdAt
                      ? formatDistanceToNow(new Date(notification?.createdAt), {
                          addSuffix: true,
                        })
                      : "3 days ago"}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Eye
                    className="stroke-blue-500 cursor-pointer"
                    onClick={() => readNotificationMutation(notification._id)}
                  />
                  <Trash2
                    className="stroke-red-500 cursor-pointer"
                    onClick={() => deleteNotification(notification._id)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "comment":
        return (
          <div className="border rounded-xl p-4 border-solid border-black flex items-center bg-yellow-50 max-w-full">
            <div className="flex items-start gap-x-4 w-full">
              <img
                src="../public/avatar.png"
                alt="profile_img"
                className="size-10"
              />
              {/* Details */}
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-y-2 itmes-cener">
                  <div className="flex gap-x-2 items-center">
                    <MessageSquare className="stroke-green-500 stroke-3" />
                    <p className="font-bold">
                      {notification?.relatedUser?.username}
                    </p>
                    <p>commented on your post</p>
                  </div>
                  <span className="text-gray-500">
                    {notification?.createdAt
                      ? formatDistanceToNow(new Date(notification?.createdAt), {
                          addSuffix: true,
                        })
                      : "3 days ago"}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Eye
                    className="stroke-blue-500 cursor-pointer"
                    onClick={() => readNotificationMutation(notification._id)}
                  />
                  <Trash2
                    className="stroke-red-500 cursor-pointer"
                    onClick={() => deleteNotification(notification._id)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "connectionAccepted":
        return (
          <div className="border rounded-xl p-4 border-solid border-black flex items-center bg-yellow-50 max-w-full">
            <div className="flex items-start gap-x-4 w-full">
              <img
                src="../public/avatar.png"
                alt="profile_img"
                className="size-10"
              />
              {/* Details */}
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2">
                    <UserPlus className="stroke-purple-500 stroke-3" />
                    <p className="font-bold">
                      {notification?.relatedUser?.username}
                    </p>
                    <p>accepted your connection request</p>
                  </div>
                  <span className="text-gray-500">
                    {notification?.createdAt
                      ? formatDistanceToNow(new Date(notification?.createdAt), {
                          addSuffix: true,
                        })
                      : "3 days ago"}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Eye
                    className="stroke-blue-500 cursor-pointer"
                    onClick={() => readNotificationMutation(notification._id)}
                  />
                  <Trash2
                    className="stroke-red-500 cursor-pointer"
                    onClick={() => deleteNotification(notification._id)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  // TESTING ZONE[S]
  console.log(notifications);
  // TESTING ZONE[E]

  return (
    <div className="min-h-full min-w-full overflow-scroll flex flex-col  bg-amber-100 ">
      <div className=" min-w-1/2 lg:min-w-[1020px] min-h-screen mt-20 mx-auto flex flex-col gap-y-4">
        {notifications?.map((notificaiton) => (
          <div>{renderNotification(notificaiton)}</div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
