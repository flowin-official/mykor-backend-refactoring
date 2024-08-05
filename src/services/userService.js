const {
  findUserById,
  updateUser,
  deleteUser,
} = require("../repositories/userRepository");
const {
  findLocationByCountryDetails,
} = require("../repositories/locationRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, userName, userEmail, country, details) {
  // country와 details로 location을 찾음.
  try {
    const location = await findLocationByCountryDetails(country, details);

    if (!location) {
      throw new Error("Location not found");
    }

    const user = await updateUser(userId, userName, userEmail, location);
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
