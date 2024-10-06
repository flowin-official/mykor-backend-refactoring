const admin = require("../config/firebase");
const db = admin.database();

const saveMessage = async (roomId, messageData) => {
  const ref = db.ref(`rooms/${roomId}`);
  try {
    await ref.push(messageData);
  } catch (error) {
    throw error;
  }
};

const findMessagesByRoomId = async (roomId) => {
  const ref = db.ref(`rooms/${roomId}`);
  try {
    const snapshot = await ref.once("value");
    const messages = snapshot.val();
    return messages;
  } catch (error) {
    throw error;
  }
};

const findRoomIdsByUserId = async (userId) => {
  const ref = db.ref("rooms");
  try {
    const snapshot = await ref.once("value");
    const rooms = snapshot.val();
    const roomIds = Object.keys(rooms).filter((roomId) => {
      const room = rooms[roomId];
      return room.members.includes(userId);
    });
    return roomIds;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveMessage,
  findMessagesByRoomId,
};
