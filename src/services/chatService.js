const {
  findRoomById,
  createChatRoom,
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

    // 방이 존재하는지 확인
    const room = await findRoomById(roomId);
    if (!room) {
      // 방이 존재하지 않으면 채팅방 생성
      await createChatRoom(roomId);
    }

    // 방이 있으면 그냥 메시지 전송
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
