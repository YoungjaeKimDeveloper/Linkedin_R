import ConnectionRequest from "../model/ConnectionRequest.model.js";

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

export const acceptConnectionRequest = (req, res) => {
  try {
  } catch (error) {}
};

export const rejectConnectionRequest = (req, res) => {
  try {
  } catch (error) {}
};

export const getConnectionRequests = (req, res) => {
  try {
  } catch (error) {}
};

export const getUserConnections = (req, res) => {
  try {
  } catch (error) {}
};

export const removeConnection = (req, res) => {
  try {
  } catch (error) {}
};
export const getConnectionsStatus = (req, res) => {
  try {
  } catch (error) {}
};
