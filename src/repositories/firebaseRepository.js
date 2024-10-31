const admin = require("../config/firebase");
const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

// firestore
// firestore 채팅방 생성 후 participants 추가
const saveRoomAndParticipants = async (userId, opponentUserId, roomId) => {
  try {
    const chatRef = firestoreDB.collection("chatRooms").doc(roomId);
    await chatRef.set({
      participants: [userId, opponentUserId],
    });
  } catch (error) {
    throw error;
  }
};

// firestore에 채팅 메시지 저장
const saveMessage = async (userId, roomId, message) => {
  try {
    const chatRef = firestoreDB.collection("chatRooms").doc(roomId);
    await chatRef.collection("messages").add({
      userId: userId,
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// firestore 채팅방에서 참여 유저 삭제
const deleteParticipant = async (userId, roomId) => {
  try {
    const chatRef = firestoreDB.collection("chatRooms").doc(roomId);

    // participants 필드 조회
    const snapshot = await chatRef.get();
    if (!snapshot.exists) {
      return;
    }

    // 유저 삭제
    const participants = snapshot.data().participants;
    const newParticipants = participants.filter((id) => id !== userId);
    await chatRef.update({ participants: newParticipants });
  } catch (error) {
    throw error;
  }
};

// firestore 채팅방에서 유저 참여 여부 조회
const findRoomByParticipants = async (userId, opponentUserId) => {
  try {
    // userId와 opponentUserId를 모두 participants로 가지는 채팅방 조회
    // 두 ID를 알파벳 순으로 정렬
    const sortedParticipants = [userId, opponentUserId].sort();

    const chatRoomsRef = firestoreDB.collection("chatRooms");
    const snapshot = await chatRoomsRef
      .where("participants", "==", sortedParticipants)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // roomId 반환
    return snapshot.docs[0].id;
  } catch (error) {
    throw error;
  }
};

// realtime db
// realtime db에 유저가 채팅방에 입장 상태임을 저장 (실시간 중요)
const saveUserTrueInRoom = async (userId, roomId) => {
  try {
    const roomRef = realtimeDB.ref(`activeChats/${roomId}`);

    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) {
      await roomRef.set({});
    }

    await roomRef.child(userId).set(true);
  } catch (error) {
    throw error;
  }
};

// realtime db에 유저가 채팅방에서 퇴장 상태임을 저장 (실시간 중요)
const saveUserFalseInRoom = async (userId, roomId) => {
  try {
    const roomRef = realtimeDB.ref(`activeChats/${roomId}`);

    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) {
      await roomRef.set({});
    }

    await roomRef.child(userId).set(false);
  } catch (error) {
    throw error;
  }
};

// 유저 채팅방 접속 상태 조회
const findUserInActiveRoom = async (userId, roomId) => {
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
  saveRoomAndParticipants,
  saveMessage,
  deleteParticipant,
  findRoomByParticipants,

  saveUserTrueInRoom,
  saveUserFalseInRoom,
  findUserInActiveRoom,
};
