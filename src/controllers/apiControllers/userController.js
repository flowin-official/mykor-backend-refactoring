const {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
} = require("../../services/userService");

async function getMyInfo(req, res) {
  const userId = req.userId;
  try {
    const user = await myInfo(userId);
    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function putMyInfo(req, res) {
  const userId = req.userId;
  const { userName, userEmail, country, location } = req.body;
  try {
    const user = await modifyMyInfo(
      userId,
      userName,
      userEmail,
      country,
      location
    );
    res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMyInfo(req, res) {
  const userId = req.userId;
  try {
    await removeMyInfo(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
};
