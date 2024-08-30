const {
  readMyNotifications,
  myNotifications,
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
 *       401:
 *         description: 액세스 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function getMyNotifications(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  try {
    const notifications = await myNotifications(userId);
    res.status(200).json({
      message: "Notifications received",
      notifications: notifications.map((notification) => ({
        ...notification.toObject(),
        fromUser: notification.fromUser.nickname,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @swagger
 * /notifications/read:
 *   post:
 *     summary: 내 알림 전부 읽기
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
 *         description: 내 알림 전부 읽기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notifications:
 *                   type: object
 *       401:
 *         description: 액세스 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function postMyNotifications(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  try {
    await readMyNotifications(userId);
    res.status(200).json({
      message: "All notification read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getMyNotifications,
  postMyNotifications,
};
