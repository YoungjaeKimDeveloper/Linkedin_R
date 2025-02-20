// Models
import ConnectionRequest from "../model/ConnectionRequest.model.js";
import Notification from "../model/notification.model.js";
import User from "../model/User.model.js";
// 요청 보내기
// Focus
// Issue
export const getConnectionsStatus = async (req, res) => {
  const friendID = req.params.userId;
  const currentUserId = req.user._id;

  // Testing Zone
  try {
    const currentUser = await User.findById(currentUserId);
    // 뿌려지는 User 들 과의 관계를 의미함
    if (currentUser?.connections?.includes(friendID)) {
      return res.json({ status: "connected" });
    }
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { recipient: friendID, sender: currentUserId },
        { recipient: currentUserId, sender: friendID },
      ],
    });

    if (pendingRequest) {
      // 현재
      if (pendingRequest?.sender?.toString() === currentUserId?.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({
          status: "received",
          requestId: pendingRequest._id,
        });
      }
    }
    // if no connection or pending req found
    return res.json({ status: "not_connected" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Server Error in [getConnectionsStatus] ${error.message}`,
    });
  }
};
// Create new connection Request
export const sendConnectionRequest = async (req, res) => {
  try {
    const currentUser = req.user;
    // 친구요청 받는 아이디
    const userId = req.params.userId;

    // 자기 자신에게 보내는 경우
    if (currentUser._id.toString() === userId.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "You cannot send request to you" });
    }
    // 이미 요청을 보낸 상태
    // 1만번 법칙 생각하기  (요청 계속 보내는것 방지)
    const existingRequest = await ConnectionRequest.findOne({
      sender: currentUser._id,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Request has been sent already" });
    }

    // 이미 친구인 경우
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Member is already in your connection",
      });
    }
    // 새로운 친구 요청 보내주기(create new ConnetionRequest)
    const newRequest = new ConnectionRequest({
      recipient: userId,
      sender: req.user._id,
      status: "pending",
    });

    await newRequest.save();
    return res.status(201).json({
      success: true,
      message: "Connection Request has been sent",
      newRequest,
    });
  } catch (error) {
    console.error("Server Error in [sendConnectionRequest", error.message);
    return res.status(500).json({
      success: false,
      message: `Server Error in [sendConnectionRequest] ${error.message}`,
    });
  }
};
// Change the UI + Change the Logic
// 친구 수락하기

export const acceptConnectionRequest = async (req, res) => {
  console.log("FUNCITON이 울립니다")
  const { requestId } = req.params;
  const userId = req.user._id;

  try {
    const requestedConnection = await ConnectionRequest.findById(requestId)
      .populate("sender", "name username profilePicture")
      .populate("recipient", "name username");
    // 친구 요청을 찾지 못하는 경우
    if (!requestedConnection) {
      console.error("친구 요청을 찾지 못하는 경우");
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the request" });
    }

    // Testing Zone[S]
    // Testing Zone[E]

    // 친구 요청을 받을 권한이 없는경우
    if (
      requestedConnection?.recipient?._id.toString() !== req.user.id.toString()
    ) {
      console.error("권한이 없습니다");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // 이미 요청이 진행된 경우
    if (requestedConnection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }
    // Change the Status for UI
    requestedConnection.status = "accepted";
    await requestedConnection.save();

    // 실제 Logic
    // 요청 보낸 친구 받아주기
    await User.findByIdAndUpdate(
      requestedConnection.sender._id,
      {
        $addToSet: { connections: userId },
      },
      { new: true }
    );
    // 현재 로그인한 유저에게 추가 해주기
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { connections: requestedConnection.sender._id },
      },
      {
        new: true,
      }
    );
    // 새로운 Notification 만들어주기
    const notification = new Notification({
      recipient: requestedConnection.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    // 만들어주고 나서 항상 저장하기
    await notification.save();
    return res
      .status(201)
      .json({ success: true, message: "Requeste Accepted ✅" });
  } catch (error) {
    console.error("ERROR IN [acceptConnectionRequest] ", error);
    return res.status(500).json({
      success: false,
      message: `Server Error in [acceptConnectionRequest] ${error.message}`,
    });
  }
};
// 친구 요청 거절하기
// 에러 나는 부분
export const rejectConnectionRequest = async (req, res) => {
  // Testing Zone[S]
  const requestedID = req.params.requestId;
  const connectionRequest = await ConnectionRequest.findById(requestedID);
  console.log("requestedID", requestedID);
  console.log("connectionRequest", connectionRequest._id);
  // Testing Zone[E]
  try {
    // connectionRequest 발견 못 한경우
    if (!connectionRequest) {
      console.error("ERROR IN [!connectionRequest]");
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the request" });
    }
    // 거절할 권한이 없는경우 (항상 권한 체크해주세용❤️)

    if (
      connectionRequest?.recipient?._id.toString() !== req.user.id.toString()
    ) {
      console.error("[rejectConnectionRequest]- Unauthorized");
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    // UI용 으로 connectionRequest.stats 만 바꿔주는것임
    await ConnectionRequest.findByIdAndDelete(requestedID);
    // 그 뒤에 로직은 따로없으
    return res
      .status(200)
      .json({ success: true, message: "Connection rejectedrejected ✅" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [rejectConnectionRequest] ${error.message}`,
    });
  }
};
// 현재 Pending중인 요청 가져오기
export const getConnectionRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requests = await ConnectionRequest.find({
      recipient: currentUserId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline");

    // Populate Chaining 해서 더 가져오기
    return res.status(200).json({
      success: true,
      message: "Successfully get all the Connection Requests✅",
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [getConnectionRequests] ${error.message}`,
    });
  }
};
// 현지 (로그인)한 유저 친구목록 불러오기
export const getUserConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "connections",
      "name username profilePicture headline connections"
    );
    return res.status(200).json({
      success: true,
      message: "Fetch user connections✅",
      connection: user.collections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [getUserConnections] ${error.message}`,
    });
  }
};
// 친구목록에서 지워주기
export const removeConnection = async (req, res) => {
  try {
    const friendId = req.params.userId;
    const currentUserId = req.user._id;
    // 상대방에서 connection Remove해주기
    await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { connections: currentUserId },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { connections: friendId },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Friend has been deleted✅" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [removeConnection] ${error.message}`,
    });
  }
};
// UI 조정을 위한 화면임

// Testing Zone[S]
// Testing Zone[E]
