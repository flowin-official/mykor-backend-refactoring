const {
  saveMessage,
  findMessagesByRoomId,
} = require("../repositories/firebaseRepository");
const { findUserById } = require("../repositories/userRepository");

async function sendMessage(roomId, userId, message) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

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
