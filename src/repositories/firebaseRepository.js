const { parseTwoDigitYear } = require("moment-timezone");
const admin = require("../config/firebase");
const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

// firestore에 채팅 메시지 저장
const saveMessage = async (opponentUserId, userId, message) => {
  try {
    // 유저 두 명의 아이디를 합쳐서 일관적인 방 아이디 생성
    const roomId = [opponentUserId, userId].sort().join("");

    const chatRef = firestoreDB.collection("chatRooms").doc(roomId);
    await chatRef.set({
      participants: [opponentUserId, userId],
    });
    await chatRef.collection("messages").add({
      userId: userId,
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에 입장 상태임을 저장 (실시간 중요)
const saveUserInRoom = async (userId, opponentUserId) => {
  try {
    const roomId = [opponentUserId, userId].sort().join("");

    await realtimeDB.ref(`activeChats/${roomId}/${userId}`).set(true);
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에서 퇴장 상태임을 저장 (실시간 중요)
const deleteUserInRoom = async (userId, opponentUserId) => {
  try {
    const roomId = [opponentUserId, userId].sort().join("");

    await realtimeDB.ref(`activeChats/${roomId}/${userId}`).set(false);
  } catch (error) {
    throw error;
  }
};

// 유저 채팅방 접속 상태 조회
const findUserInRoom = async (userId, opponentUserId) => {
  try {
    const roomId = [opponentUserId, userId].sort().join("");

    const snapshot = await realtimeDB
      .ref(`activeChats/${roomId}/${userId}`)
      .once("value");
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveMessage,
  saveUserInRoom,
  deleteUserInRoom,
  findUserInRoom,
};
