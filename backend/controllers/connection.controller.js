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
    const requests = await ConnectionRequest.find(
      { recipient: currentUserId },
      { status: "pending" }
    ).populate("sender", "name username profilePicture headline");
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

// export const getUserConnections = (req, res) => {
//   try {
//   } catch (error) {}
// };

// export const removeConnection = (req, res) => {
//   try {
//   } catch (error) {}
// };
// export const getConnectionsStatus = (req, res) => {
//   try {
//   } catch (error) {}
// };
