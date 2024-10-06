const {
  saveMessage,
  findMessagesByRoomId,
} = require("../repositories/firebaseRepository");
const { findUserById } = require("../repositories/userRepository");

async function sendMessage(opponentUserId, userId, message) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const roomId = "".join(sorted([opponentUserId, userId])); // 유저 두명의 아이디를 합쳐서 일관적인 방 아이디 생성

    const messageData = { userId, message, timestamp: Date.now() };
    await saveMessage(roomId, messageData);
  } catch (error) {
    throw error;
  }
}

async function messagesInRoom(roomId) {
  try {
    const messages = await findMessagesByRoomId(roomId);
    return messages;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendMessage,
  messagesInRoom,
};
