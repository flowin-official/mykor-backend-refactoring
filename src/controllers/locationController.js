const { allLocations } = require("../services/locationService");

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: 장소 관련 API
 */

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: 지원중인 모든 장소 조회
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: 모든 장소 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
async function getLocations(req, res) {
  try {
    const locations = await allLocations();
    res.status(200).json({
      message: "Locations found",
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getLocations,
};
