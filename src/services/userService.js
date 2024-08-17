const {
  findUserById,
  updateUser,
  deleteUser,
} = require("../repositories/userRepository");
const { findLocationByCountry } = require("../repositories/locationRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, userName, userEmail, country) {
  try {
    // 지원 중인 country인지 확인
    const userLocation = await findLocationByCountry(country);
    if (!location) {
      throw new Error("Location not found");
    }

    const user = await updateUser(userId, userName, userEmail, userLocation);
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

module.exports = {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
};
