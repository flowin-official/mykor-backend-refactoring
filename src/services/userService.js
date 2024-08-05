const {
  findUserById,
  updateUser,
  deleteUser,
} = require("../repositories/userRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, userName, userEmail, country, location) {
  try {
    const user = await updateUser(
      userId,
      userName,
      userEmail,
      country,
      location
    );
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
