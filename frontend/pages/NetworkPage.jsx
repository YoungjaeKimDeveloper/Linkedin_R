// External
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// Internal
// Internal - Components
import Sidebar from "../components/Home/Sidebar";
import NetworkUser from "../components/Network/NetworkUser";
// Internal - Utility
import { axiosInstance } from "../src/lib/axiosInstance";

const NetworkPage = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: connectionRequests, isLoading: fetchConnectionRequest } =
    useQuery({
      queryKey: ["connectionRequests"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/connections/requests");
          toast.success("Fetched the connectionRequested successfully ✅");
          return res?.data.requests;
        } catch (error) {
          console.error("ERROR IN [Fetching connectionRequests]", error);
          toast.error("ERROR IN [Fetching connectionRequests]");
        }
      },
    });
  // 친구 수락하기
  const { mutate: accpetFriendMutate } = useMutation({
    mutationFn: async (requestId) => {
      console.log("DATA", requestId);
      await axiosInstance.put(`/connections/accpet/${requestId}`);
    },
    onSuccess: () => {
      toast.success("User has been accepted successfully ✅");
      queryClient.invalidateQueries({ queryKey: "connectionRequests" });
    },
    onError: (error) => {
      console.error("ERROR IN[accpetFriendMutate]", error);
      toast.error("ERROR IN[accpetFriendMutate]");
    },
  });
  // Testing
  if (!fetchConnectionRequest) {
    console.log(connectionRequests);
    console.log(
      "-T: connectionRequests",
      connectionRequests[0]?.sender.username
    );
  }

  return (
    <div className=" min-h-screen min-w-screen grid grid-col-1 lg:grid-cols-3 px-10 py-4 shadow-lg mt-10">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar authUser={authUser} />
      </div>
      {/* Network Component */}
      <div className="col-span-2 bg-white max-w-[600px] max-h-[400px]  p-2 rounded-xl shadow-sm">
        <div className=" max-w-[600px] rounded-2xl">
          <h2 className="text-2xl font-bold">My Network</h2>
          <p className="text-gray-400 py-2">Connection Request</p>
          {/* Request-Layout */}
          <div className="overflow-scroll max-w-[600px] max-h-[400px] flex flex-col">
            <div className="w-full p-2 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center"></div>
            </div>
            {/* Request User */}
            {connectionRequests?.length == 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                No Connection
              </div>
            ) : (
              <div>
                {connectionRequests?.map((connectionRequest) => (
                  <NetworkUser
                    key={connectionRequest._id}
                    username={connectionRequest?.sender?.username}
                    profilePic={connectionRequest?.sender?.profilePic}
                    onClick={() => {
                      accpetFriendMutate(connectionRequest._id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
