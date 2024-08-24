const UserBlock = require("../models/userBlock");

const createUserBlock = async (userId, blockedUserId) => {
  try {
    const userBlock = await UserBlock.create({
      user: userId,
      blockedUser: blockedUserId,
    });
    return userBlock;
  } catch (error) {
    throw error;
  }
};

const deleteUserBlock = async (userId, blockedUserId) => {
  try {
    await UserBlock.findOneAndDelete({
      user: userId,
      blockedUser: blockedUserId,
    });
  } catch (error) {
    throw error;
  }
};

const findBlockedUsersByUserId = async (userId) => {
  try {
    const blockedUsers = await UserBlock.find({ user: userId });
    return blockedUsers;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUserBlock,
  deleteUserBlock,
  findBlockedUsersByUserId,
};
