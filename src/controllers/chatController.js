const {
  sendMessage,
  exitChatRoom,
  onlineChatRoom,
  offlineChatRoom,
} = require("../services/chatService");
const { sendChatPush } = require("../services/notificationService");

// 채팅 전송
async function postChatSend(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { opponentUserId, message } = req.body;
  try {
    await sendMessage(userId, opponentUserId, message);
    await sendChatPush(userId, opponentUserId, message);
    res.status(200).json({
      message: "Message sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 채팅방 나가기
async function postChatExit(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { roomId } = req.body;
  try {
    await exitChatRoom(userId, roomId);
    res.status(200).json({
      message: "Exited chat room",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 채팅방 온라인
async function postChatOnline(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { roomId } = req.body;
  try {
    await onlineChatRoom(userId, roomId);
    res.status(200).json({
      message: "Entered chat room",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 채팅방 오프라인
async function postChatOffline(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { roomId } = req.body;
  try {
    await offlineChatRoom(userId, roomId);
    res.status(200).json({
      message: "Exited chat room",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postChatSend,
  postChatExit,
  postChatOnline,
  postChatOffline,
};
