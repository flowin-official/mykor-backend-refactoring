const {
  notificationsByUser,
  readNotification,
} = require("../services/notificationService");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 알림 관련 API
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: 내 알림 받기
 *     tags: [Notifications]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: 내 알림 받기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notifications:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function getMyNotifications(req, res) {
  const userId = req.userId;
  try {
    const notifications = await notificationsByUser(userId);
    res.status(200).json({
      message: "Notifications received",
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @swagger
 * /notification/:notificationId:
 *   get:
 *     summary: 알림 선택
 *     tags: [Notifications]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 알림 선택 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: 서버 에러
 */
async function postThisNotification(req, res) {
  // 알림 선택 -> 해당 게시물로 이동 -> 알림 읽음 처리
  const userId = req.userId;
  const notificationId = req.params.notificationId;
  try {
    await readNotification(userId, notificationId);
    res.status(200).json({
      message: "Notification selected",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getMyNotifications,
  postThisNotification,
};
