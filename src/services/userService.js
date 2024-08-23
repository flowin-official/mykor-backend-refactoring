const {
  findUserById,
  updateUser,
  deleteUser,
} = require("../repositories/userRepository");
const { findLocationById } = require("../repositories/locationRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, nickname, locationId) {
  try {
    let user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // 지원 중인 location인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    user = await updateUser(user, nickname, location);
    return user;
  } catch (error) {
    throw error;
  }
}

async function removeMyInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await deleteUser(user);
  } catch (error) {
    throw error;
  }
}

async function userInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
  userInfo,
};
