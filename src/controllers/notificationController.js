const {
  unreadNotifications,
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
 *     summary: 내 알림들 읽기
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
 *         description: 내 알림들 읽기 성공
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
        fromUser: notification.fromUser,
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
 * /notification:
 *   get:
 *     summary: 안읽은 알림 존재여부 확인
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
 *         description: 안읽은 알림들 반환
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
async function getNotification(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  try {
    notifications = await unreadNotifications(userId);

    res.status(200).json({
      message: "Notifications exist",
      notifications: notifications.map((notification) => ({
        ...notification.toObject(),
        fromUser: {
          _id: notification.fromUser._id,
          nickname: notification.fromUser.nickname,
          location: notification.fromUser.location,
          deleted: notification.fromUser.deleted,
        },
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getMyNotifications,
  getNotification,
};
