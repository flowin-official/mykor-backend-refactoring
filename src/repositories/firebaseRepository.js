const admin = require("../config/firebase");
const firestore = admin.firestore();
const realtimedb = admin.database();

// firestore에 채팅 메시지 저장
const saveMessage = async (roomId, messageData) => {
  const chatRef = firestore.collection("chats").doc(roomId);

  try {
    await chatRef.collection("messages").add(messageData);
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에 입장 상태임을 저장 (실시간 중요)
const saveUserInRoom = async (userId, roomId) => {
  try {
    await realtimedb.ref(`activeChats/${roomId}/${userId}`).set(true);
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에서 퇴장 상태임을 저장 (실시간 중요)
const deleteUserInRoom = async (userId, roomId) => {
  try {
    await realtimedb.ref(`activeChats/${roomId}/${userId}`).remove();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveMessage,
  saveUserInRoom,
  deleteUserInRoom,
};
