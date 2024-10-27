const admin = require("../config/firebase");
const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

const findRoomById = async (roomId) => {
  try {
    const snapshot = await firestoreDB
      .collection("chatRooms")
      .doc(roomId)
      .get();
    return snapshot.data();
  } catch (error) {
    throw error;
  }
};

const createChatRoom = async (roomId) => {
  try {
    await firestoreDB.collection("chatRooms").doc(roomId).set({});
  } catch (error) {
    throw error;
  }
};

// firestore에 채팅 메시지 저장
const saveMessage = async (roomId, userId, message) => {
  try {
    await firestoreDB
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages")
      .add({
        senderId: userId,
        text: message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에 입장 상태임을 저장 (실시간 중요)
const saveUserInRoom = async (userId, roomId) => {
  try {
    await realtimeDB.ref(`activeChats/${roomId}/${userId}`).set(true);
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에서 퇴장 상태임을 저장 (실시간 중요)
const deleteUserInRoom = async (userId, roomId) => {
  try {
    await realtimeDB.ref(`activeChats/${roomId}/${userId}`).set(false);
  } catch (error) {
    throw error;
  }
};

const findUserInRoom = async (userId, roomId) => {
  try {
    const snapshot = await realtimeDB
      .ref(`activeChats/${roomId}/${userId}`)
      .once("value");
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findRoomById,
  createChatRoom,
  saveMessage,
  saveUserInRoom,
  deleteUserInRoom,
  findUserInRoom,
};
