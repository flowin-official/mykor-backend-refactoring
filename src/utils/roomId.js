function generateRoomId(userId, opponentUserId) {
  const roomId = [opponentUserId, userId].sort().join("") + Date.now();
  return roomId;
}

module.exports = { generateRoomId };
