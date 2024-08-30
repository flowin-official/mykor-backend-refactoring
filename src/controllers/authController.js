const {
  loginAppleUser,
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
 *               authCode:
 *                 type: string
 *                 description: 카카오 인증 코드
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
 *                   description: 사용자 정보
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       500:
 *         description: 서버 에러
 */
async function postKakaoLogin(req, res) {
  const { authCode } = req.body;
  try {
    const { user, accessToken, refreshToken } = await loginKakaoUser(authCode);
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
 * /login/apple:
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
 *               authCode:
 *                type: string
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
async function postAppleLogin(req, res) {
  const { authCode } = req.body;
  try {
    const { user, accessToken, refreshToken } = await loginAppleUser(authCode);
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
 *                 description: 리프레시 토큰
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
 *                 newAccessToken:
 *                   type: string
 *                 newRefreshToken:
 *                   type: string
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
    const { newAccessToken, newRefreshToken } = await refreshNewTokens(
      refreshToken
    );
    res.status(200).json({
      message: "Tokens refreshed",
      newAccessToken,
      newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postAppleLogin,
  postKakaoLogin,
  postRefresh,
};
