const {
  // registerUser,
  // loginUser,
  loginKakaoUser,
  refreshNewTokens,
} = require("../services/authService");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /login/kakao:
 *   post:
 *     summary: 카카오 로그인(회원가입)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kakaoUserCode:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       500:
 *         description: 서버 에러
 */
async function postKakaoLogin(req, res) {
  const { kakaoUserCode, userName } = req.body;
  try {
    const { user, accessToken, refreshToken } = await loginKakaoUser(
      kakaoUserCode,
      userName
    );
    res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: 토큰 재발급
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newTokens:
 *                   type: object
 *       403:
 *         description: 리프레시 토큰이 필요합니다.
 *       500:
 *         description: 서버 에러
 */
async function postRefresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    const newTokens = await refreshNewTokens(refreshToken);
    res.status(200).json({
      message: "Tokens refreshed",
      newTokens,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  // postSignup,
  // postLogin,
  postKakaoLogin,
  postRefresh,
};
