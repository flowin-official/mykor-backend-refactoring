const {
  saveMessage,
  saveUserInRoom,
  deleteUserInRoom,
} = require("../repositories/firebaseRepository");
const { findUserById } = require("../repositories/userRepository");

async function sendMessage(opponentUserId, userId, message) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await saveMessage(opponentUserId, userId, message);
  } catch (error) {
    throw error;
  }
}

async function enterChatRoom(userId, opponentUserId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await saveUserInRoom(userId, opponentUserId);
  } catch (error) {
    throw error;
  }
}

async function exitChatRoom(userId, opponentUserId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await deleteUserInRoom(userId, opponentUserId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendMessage,
  enterChatRoom,
  exitChatRoom,
};
