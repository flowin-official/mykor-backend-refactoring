const { allTags } = require("../services/tagService");

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: 태그 관련 API
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: 지원중인 모든 태그 조회
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: 모든 태그 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
async function getTags(req, res) {
  try {
    const tags = await allTags();
    res.status(200).json({
      message: "Tags found",
      tags,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTags,
};
