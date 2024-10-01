const { sendMessage, messagesInRoom } = require("../services/chatService");

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: 채팅 관련 API
 */

/**
 * @swagger
 * /message:
 *   post:
 *     summary: 채팅 메시지 전송
 *     tags: [Chats]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: 채팅 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: 서버 에러
 */
async function postChatMessage(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  const { roomId, message } = req.body;
  try {
    await sendMessage(roomId, userId, message);
    res.status(200).json({
      message: "Message sent",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

/**
 * @swagger
 * /messages/{roomId}:
 *   get:
 *     summary: 채팅방 메시지 조회
 *     tags: [Chats]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: 채팅방 ID
 *     responses:
 *       200:
 *         description: 범위 내 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: 서버 에러
 */
async function getChatMessages(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const roomId = req.params.roomId;
  try {
    const messages = await messagesInRoom(roomId);
    res.status(200).json({
      message: "Messages in room",
      posts: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  postChatMessage,
  getChatMessages,
};
