const {
  sendMessage,
  enterChatRoom,
  exitChatRoom,
} = require("../services/chatService");
const { sendChatPush } = require("../services/notificationService");

// 채팅 전송
async function postChatMessage(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { opponentUserId, message } = req.body;
  try {
    await sendMessage(opponentUserId, userId, message);
    await sendChatPush(opponentUserId, userId, message);
    res.status(200).json({
      message: "Message sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 채팅방 입장
async function postChatEnter(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { opponentUserId } = req.body;
  try {
    await enterChatRoom(userId, opponentUserId);
    res.status(200).json({
      message: "Entered chat room",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 채팅방 퇴장
async function postChatExit(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { opponentUserId } = req.body;
  try {
    await exitChatRoom(userId, opponentUserId);
    res.status(200).json({
      message: "Exited chat room",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postChatMessage,
  postChatEnter,
  postChatExit,
};
