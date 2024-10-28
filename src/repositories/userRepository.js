const User = require("../models/user");

const createKakaoUser = async (kakaoUserCode, fcmToken) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  try {
    const user = await User.create({
      kakaoUserCode,
      nickname: "익명" + `${code}`,
      fcmToken,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createAppleUser = async (appleUserCode, fcmToken) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  try {
    const user = await User.create({
      appleUserCode,
      nickname: "익명" + `${code}`,
      fcmToken,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createGoogleUser = async (googleUserCode, fcmToken) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  try {
    const user = await User.create({
      googleUserCode,
      nickname: "익명" + `${code}`,
      fcmToken,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserByKakaoUserCode = async (kakaoUserCode) => {
  try {
    const user = await User.findOne({
      kakaoUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserByAppleUserCode = async (appleUserCode) => {
  try {
    const user = await User.findOne({
      appleUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserByGoogleUserCode = async (googleUserCode) => {
  try {
    const user = await User.findOne({
      googleUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, nickname, locationId, profileImage) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        nickname,
        location: locationId,
        profileImage,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const withdrawUser = async (userId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        deleted: Date.now(),
        kakaoUserCode: "deleted user",
        appleUserCode: "deleted user",
        googleUserCode: "deleted user",
      },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

const addBlockUser = async (userId, blockedUserId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { blockedUsers: blockedUserId },
      },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

const refreshFcmToken = async (userId, fcmToken) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        fcmToken,
      },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createKakaoUser,
  createAppleUser,
  createGoogleUser,

  findUserByKakaoUserCode,
  findUserByAppleUserCode,
  findUserByGoogleUserCode,

  findUserById,

  updateUser,

  withdrawUser,

  addBlockUser,

  refreshFcmToken,
};
