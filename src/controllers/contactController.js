const { sendContact } = require("../services/contactService");

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: 연락 관련 API
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: 문의 메시지 보내기
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: 문의 메시지 전송 성공
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
async function postContact(req, res) {
  const { country, details } = req.body;
  try {
    await sendContact(country, details);
    res.status(201).json({
      message: "Contact message sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postContact,
};
