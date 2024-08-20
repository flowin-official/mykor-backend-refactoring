const {
  findUserById,
  updateUser,
  deleteUser,
} = require("../repositories/userRepository");
const { findLocationById } = require("../repositories/locationRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, userName, locationId) {
  try {
    // 지원 중인 location인지 확인
    const userLocation = await findLocationById(locationId);
    if (!userLocation) {
      throw new Error("Location not found");
    }

    const user = await updateUser(userId, userName, userLocation);
    return user;
  } catch (error) {
    throw error;
  }
}

async function removeMyInfo(userId) {
  try {
    await deleteUser(userId);
  } catch (error) {
    throw error;
  }
}

async function userInfo(userId) {
  try {
    const user = await findUserById(userId);
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
