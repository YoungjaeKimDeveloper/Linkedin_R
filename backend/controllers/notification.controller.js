import Notification from "../model/notification.model.js";
// 실제 notifiaciotn 보여주는 Page
export const getNotifications = async (req, res) => {
  try {
    const userID = req.user.id;
    const notifications = await Notification.find({ recipient: userID })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image")
      .sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("ERROR IN [getNotifications] ", error.message);
    return res.status(500).json({
      success: false,
      message: `Server ERROR IN getNotifications ${error.message}`,
    });
  }
};
// Notification 읽은걸로 표시
export const readNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const userID = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: userID,
      },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the notification" });
    }
    return res.status(200).json(notification);
  } catch (error) {
    console.error("ERROR IN readNotification", error.message);
    return res.status(500).json({
      success: false,
      messsage: `Server Error in [readNotification] ${error.message}`,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
    // Validation
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the Notification" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification has been deleted ✅",
      notification,
    });
  } catch (error) {
    console.error("Error in [deleteNotification]", error.message);
    return res.status(500).json({
      success: false,
      messsage: `Server Error in [deleteNotification] ${error.message}`,
    });
  }
};
// 프론트엔드에서 어떤 요청해올지 계속 생각하고 있어야함
