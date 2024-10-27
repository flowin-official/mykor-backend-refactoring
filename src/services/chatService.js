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

    // 유저 두 명의 아이디를 합쳐서 일관적인 방 아이디 생성
    const roomId = [opponentUserId, userId].sort().join("");

    await saveMessage(roomId, userId, message);
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

    const roomId = [opponentUserId, userId].sort().join("");
    await saveUserInRoom(userId, roomId);
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

    const roomId = [opponentUserId, userId].sort().join("");
    await deleteUserInRoom(userId, roomId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendMessage,
  enterChatRoom,
  exitChatRoom,
};
