// External
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// Internal
import avatar from "../../public/avatar.png";
import { axiosInstance } from "../../src/lib/axiosInstance";

const RecommendedUser = ({ recommendedUser }) => {
  console.log("Recommend User", recommendedUser);
  const queryClient = useQueryClient();

  const { name, headline, profilePicture } = recommendedUser;
  // Change the connection request UI

  const { data: connectionStatus, isLoading: connectionLoading } = useQuery({
    // 캐시 개별적으로 관리해주기
    queryKey: ["connectionStatus", recommendedUser._id],
    queryFn: async () => {
      ("UERQUERY 울림");
      try {
        toast.success("Fetch the Connection status Successfully ✅");
        const res = await axiosInstance.get(
          `/connections/status/${recommendedUser._id}`
        );

        return res?.data;
      } catch (error) {
        console.error("SERVER ERROR IN [connectionStatus]", error);
        toast.error("SERVER ERROR IN [connectionStatus]");
      }
    },
  });
  // 친구 요청 보내기
  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: async (userId) => {
      await axiosInstance.post(`/connections/request/${userId}`);
    },
    onSuccess: () => {
      toast.success("Request has been sent successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", recommendedUser._id],
      });
    },
    onError: (error) => {
      "ERROR IN [sendRequestMutation]", error;
      toast.error("ERROR IN [sendRequestMutation]");
    },
  });
  // 친구 수락하기
  const { mutate: acceptRequestMutation } = useMutation({
    mutationFn: async (requestId) => {
      await axiosInstance.put(`/connections/accpet/${requestId}`);
    },
    onSuccess: () => {
      toast.success("Accept the Request Successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", recommendedUser._id],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("ERROR IN acceptRequestMutation", error);
      toast.error("ERROR IN [acceptRequestMutation]");
    },
  });
  // 친구 요청 거절하기
  const { mutate: rejectConnectionRequestMutation } = useMutation({
    mutationFn: async (requestId) => {
      console.log("requestId: ", requestId);
      await axiosInstance.put(`/connections/reject/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", recommendedUser._id],
      });
    },
    onError: (error) => {
      console.error("ERROR IN rejectConnectionRequestMutation", error);
      toast.error("ERROR IN [rejectConnectionRequestMutation]");
    },
  });
  // Status에 맞게 버튼 보여주기
  // 버튼 UI에 따라 가능/불가능 하게 하기
  const renderBTN = () => {
    if (connectionLoading) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
          disabled
        >
          Loading...
        </button>
      );
    }
    switch (connectionStatus?.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      // 선택할수있게
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              // Requestd
              onClick={() => acceptRequestMutation(connectionStatus?.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() =>
                rejectConnectionRequestMutation(connectionStatus?.requestId)
              }
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center"
            onClick={handleConnect}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };
  const handleConnect = () => {
    sendRequestMutation(recommendedUser._id);
  };
  return (
    <div className="flex justify-between items-center bg-blue">
      <Link
        to={`/user/profile/${recommendedUser.name}`}
        className="flex items-center"
      >
        <img
          src={profilePicture || avatar}
          alt="vatar"
          className="size-10 mr-2"
        />
        <div>
          <p className="text-sm text-gray-500">{name}</p>
          <p className="text-sm text-gray-400">{headline}</p>
        </div>
      </Link>
      {renderBTN()}
    </div>
  );
};

export default RecommendedUser;
