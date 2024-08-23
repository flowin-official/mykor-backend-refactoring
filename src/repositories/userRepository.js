const User = require("../models/user");

const createKakaoUser = async (kakaoUserCode) => {
  try {
    const user = await User.create({
      kakaoUserCode,
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
  findUserByKakaoUserCode,
  findUserById,
  updateUser,
  deleteUser,
};
