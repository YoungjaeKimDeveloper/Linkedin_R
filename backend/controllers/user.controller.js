import User from "../model/User.model.js";
import cloudinary from "../lib/cloudinary.config.js";
export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select("connections");
    const suggesstedUsers = await User.find({
      _id: { $ne: req.user.id, $nin: currentUser.connections },
    })
      .select("name profilePicture headline")
      .limit(3);
    return res.json(suggesstedUsers);
  } catch (error) {
    console.error("ERROR IN [getSuggestedConnections]", error.message);
    return res.status(404).json({
      success: false,
      message: `CANNOT FIND THE SUGGESTED USER: ${error.message}  `,
    });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const selectedUser = await User.findOne({ username }).select("-password");
    if (!selectedUser) {
      return res.status(404).json({
        success: false,
        message: "Cannot find the user with the name",
      });
    }
    return res.json(selectedUser);
  } catch (error) {
    console.error("ERROR IN [getPublicProfile]", error.message);
    return res.status({
      success: false,
      message: `CANNOT FIND THE USER ${error.message}`,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // 나중에 UserProfile 에서 바꿀수있도록 해주기위함
    const allowField = [
      "profilePicture",
      "bannerImg",

      "headline",
      "location",
      "about",
      "skills",
      "experience",
      "education",
    ];
    // 새로 업데이트 해줄 정보 담을 변수
    const updatedData = {};
    // 요청을 보낸 body에 field가 있을경우
    for (const field of allowField) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
    // 이미지들은 따로 관리해주기
    if (req.body.profilePicture) {
      try {
        const result = await cloudinary.uploader.upload(
          req.body.profilePicture
        );
        updatedData.profilePicture = result.secure_url;
      } catch (error) {
        console.error("Failed to update profilePicture", error.message);
      }
    }
    // 이미지들은 따로 관리해주기
    if (req.body.bannerImg) {
      try {
        const result = await cloudinary.uploader.upload(req.body.bannerImg);
        updatedData.bannerImg = result.secure_url;
      } catch (error) {
        console.error("Failed to update user bannerImg", error.message);
      }
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );
    return res.json(user);
  } catch (error) {
    console.error("ERROR IN [updateProfile]", error.message);
    return res.status(401).json({
      success: false,
      message: `FAILED TO UPDATE PROFILE ${error.message}`,
    });
  }
};
