const {
  saveRoomAndParticipants,
  saveMessage,
  deleteParticipant,
  findRoomByParticipants,

  saveUserTrueInRoom,
  saveUserFalseInRoom,
} = require("../repositories/firebaseRepository");
const { findUserById } = require("../repositories/userRepository");
const { generateRoomId } = require("../utils/roomId");

// 메시지 전송 요청
async function sendMessage(userId, opponentUserId, message) {
  try {
    // 유저 유효성 검사
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const opponentUser = await findUserById(opponentUserId);
    if (!opponentUser) {
      throw new Error("Opponent user not found");
    }

    // 상대방과 참여중인 방이 있는지 확인
    let roomId = await findRoomByParticipants(userId, opponentUserId);
    if (!roomId) {
      // 없으면 새로 생성
      roomId = generateRoomId(userId, opponentUserId);
      await saveRoomAndParticipants(userId, opponentUserId, roomId);
      await saveUserTrueInRoom(userId, roomId); // 접속시작
    }

    await saveMessage(userId, roomId, message);
  } catch (error) {
    throw error;
  }
}

// 채팅방 나가기
async function exitChatRoom(userId, roomId) {
  try {
    // 유저 유효성 검사
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await deleteParticipant(userId, roomId);
    await saveUserFalseInRoom(userId, roomId); // 접속종료
  } catch (error) {
    throw error;
  }
}

// 채팅방 접속
async function onlineChatRoom(userId, roomId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await saveUserTrueInRoom(userId, roomId);
  } catch (error) {
    throw error;
  }
}

// 채팅방 접속 종료
async function offlineChatRoom(userId, roomId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await saveUserFalseInRoom(userId, roomId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendMessage,
  exitChatRoom,
  onlineChatRoom,
  offlineChatRoom,
};
