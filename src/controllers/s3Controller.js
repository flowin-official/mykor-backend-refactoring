const { generatePresignedUrl } = require("../services/s3Service");

/**
 * @swagger
 * tags:
 *   name: S3
 *   description: S3 관련 API
 */

/**
 * @swagger
 * /presigned-url:
 *   post:
 *     summary: 이미지를 업로드하기 위한 presigned URL 생성
 *     tags: [S3]
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
 *               purpose:
 *                 type: string
 *               count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: presigned URL 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 key:
 *                   type: string
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function postPresignedUrl(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  try {
    const { purpose, count } = req.body;

    // presigned URL 생성
    const { url, keys } = await generatePresignedUrl(userId, purpose, count);

    return res.status(200).json({ url, keys });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}

module.exports = {
  postPresignedUrl,
};
