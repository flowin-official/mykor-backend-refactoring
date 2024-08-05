const {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
} = require("../services/userService");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 관련 API
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: 내 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: 서버 에러
 */
async function getMyInfo(req, res) {
  const userId = req.userId;
  try {
    const user = await myInfo(userId);
    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user:
 *   put:
 *     summary: 내 정보 수정
 *     tags: [Users]
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
 *               userName:
 *                 type: string
 *               userEmail:
 *                 type: string
 *               userLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: 내 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: 서버 에러
 */
async function putMyInfo(req, res) {
  const userId = req.userId;
  const { userName, userEmail, userLocation } = req.body;
  try {
    const user = await modifyMyInfo(userId, userName, userEmail, userLocation);
    res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: 내 정보 삭제
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: 내 정보 삭제 성공
 *       500:
 *         description: 서버 에러
 */
async function deleteMyInfo(req, res) {
  const userId = req.userId;
  try {
    await removeMyInfo(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
};
