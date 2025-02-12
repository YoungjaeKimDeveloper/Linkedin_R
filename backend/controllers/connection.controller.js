// Models
import ConnectionRequest from "../model/ConnectionRequest.model.js";
import Notification from "../model/notification.model.js";
import User from "../model/User.model.js";
// 요청 보내기
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = req.user;

    // 자기 자신에게 보내는 경우
    if (currentUser.id.toString() === userId.toString()) {
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
    // 이미 connection에 들어와있는경우
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Member is already in your connection",
      });
    }
    // 요청이 보내져 있는경우
    const previousRequest = await ConnectionRequest.findOne({
      recipient: userId,
      sender: currentUser.id,
      status: "pending",
    });
    if (previousRequest) {
      return res
        .staus(401)
        .json({ success: false, message: "Request has been sent." });
    }
    const newRequest = new ConnectionRequest({
      recipient: userId,
      sender: req.user.id,
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
// Connection Request Accept
export const acceptConnectionRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;
  try {
    const requestedConnection = await ConnectionRequest.findById(requestId)
      .populate("sender", "name username profilePicture")
      .populate("recipient", "name username");
    // Request를 못 찾는경우
    if (!requestedConnection) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the request" });
    }
    // Unauthorized 권한이 없는경우
    if (requestedConnection.recipient.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // 이미 connection 완료 눌렀을때
    if (requestedConnection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }
    requestedConnection.status = "accepted";
    await requestedConnection.save();

    // - 서로 친구 항목에 추가 해 주기

    // 보낸사람에게 connection추가해주기
    await User.findByIdAndUpdate(
      requestedConnection.sender._id,
      {
        $addToSet: { connections: userId },
      },
      { new: true }
    );
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
    return res.status(500).json({
      success: false,
      message: `Server Error in [acceptConnectionRequest] ${error.message}`,
    });
  }
};
// Connection 거절하기
export const rejectConnectionRequest = async (req, res) => {
  try {
    const requestedID = req.params.requestId;
    const connectionRequest = await ConnectionRequest.findById(requestedID);
    // connectionRequest 발견 못 한경우
    if (!connectionRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the request" });
    }
    // 거절할 권한이 없는경우 (항상 권한 체크해주세용❤️)
    if (connectionRequest.recipient.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    connectionRequest.status = "rejected";
    await connectionRequest.save();
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
// 받은 전체 요청 가져오기
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

export const getConnectionsStatus = async (req, res) => {
  try {
    const friendID = req.params.userId;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (currentUser.connections.includes(friendID)) {
      return res.json({ status: "connected" });
    }
    const pendingRequest = await ConnectionRequest.find({
      $or: [
        { recipient: friendID, sender: currentUserId },
        { recipient: currentUserId, sender: friendID },
      ],
    });
    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }
    // if no connection or pending req found
    return res.json({ status: "not_connected" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [getConnectionsStatus] ${error.message}`,
    });
  }
};
