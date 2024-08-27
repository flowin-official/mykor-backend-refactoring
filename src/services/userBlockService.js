const { createUserBlock } = require("../repositories/userBlockRepository");
const { findUserById } = require("../repositories/userRepository");

const newBlockUser = async (userId, blockedUserId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const blockedUser = await findUserById(blockedUserId);
    if (!blockedUser) {
      throw new Error("Blocked user not found");
    }

    await createUserBlock(user, blockedUser);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  newBlockUser,
};
