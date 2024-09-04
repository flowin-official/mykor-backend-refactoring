const User = require("../models/user");

const createKakaoUser = async (kakaoUserCode) => {
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
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createAppleUser = async (appleUserCode) => {
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

const updateUser = async (userId, nickname, locationId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        nickname,
        location: locationId,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createKakaoUser,
  createAppleUser,
  findUserByKakaoUserCode,
  findUserByAppleUserCode,
  findUserById,
  updateUser,
  deleteUser,
};
