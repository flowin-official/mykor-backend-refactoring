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

    // 마지막 전송한 메시지 필드 업데이트
    await chatRef.update({
      lastMessage: message,
      lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
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
    // chatRooms 컬렉션 참조
    const chatRoomsRef = firestoreDB.collection("chatRooms");

    // userId와 opponentUserId가 participants 배열에 모두 포함된 채팅방 조회
    const snapshot = await chatRoomsRef
      .where("participants", "array-contains", userId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // snapshot에서 participants에 opponentUserId가 포함된 문서 찾기
    const matchingRoom = snapshot.docs.find((doc) =>
      doc.data().participants.includes(opponentUserId)
    );

    // roomId 반환 또는 null 반환
    return matchingRoom ? matchingRoom.id : null;
  } catch (error) {
    throw error;
  }
};

// realtime db
// realtime db에 유저가 채팅방에 입장 상태임을 저장 (실시간 중요)
const saveUserTrueInActiveRoom = async (userId, roomId) => {
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
const saveUserFalseInActiveRoom = async (userId, roomId) => {
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

// 유저 채팅방 알림 끄기
const saveUserTrueInBlockRoom = async (userId, roomId) => {
  try {
    const roomRef = realtimeDB.ref(`blockRooms/${roomId}`);

    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) {
      await roomRef.set({});
    }

    await roomRef.child(userId).set(true);
  } catch (error) {
    throw error;
  }
};

// 유저 채팅방 알림 켜기
const saveUserFalseInBlockRoom = async (userId, roomId) => {
  try {
    const roomRef = realtimeDB.ref(`blockRooms/${roomId}`);

    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) {
      await roomRef.set({});
    }

    await roomRef.child(userId).set(false);
  } catch (error) {
    throw error;
  }
};

// 유저 채팅방 알림 차단 상태 조회
const findUserInBlockRoom = async (userId, roomId) => {
  try {
    const snapshot = await realtimeDB
      .ref(`blockRooms/${roomId}/${userId}`)
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

  saveUserTrueInActiveRoom,
  saveUserFalseInActiveRoom,
  findUserInActiveRoom,

  saveUserTrueInBlockRoom,
  saveUserFalseInBlockRoom,
  findUserInBlockRoom,
};
