const {
  loginAppleUser,
  loginKakaoUser,
  loginGoogleUser,
  refreshNewTokens,
} = require("../services/authService");

async function postKakaoLogin(req, res) {
  const { authCode, fcmToken } = req.body;
  try {
    const { user, accessToken, refreshToken, firebaseCustomToken } =
      await loginKakaoUser(authCode, fcmToken);
    res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
      firebaseCustomToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postAppleLogin(req, res) {
  const { authCode, fcmToken } = req.body;
  try {
    const { user, accessToken, refreshToken, firebaseCustomToken } =
      await loginAppleUser(authCode, fcmToken);
    res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
      firebaseCustomToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postGoogleLogin(req, res) {
  const { authCode, fcmToken } = req.body;
  try {
    const { user, accessToken, refreshToken, firebaseCustomToken } =
      await loginGoogleUser(authCode, fcmToken);
    res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
      firebaseCustomToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postRefresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const { user, newAccessToken, newRefreshToken, firebaseCustomToken } =
      await refreshNewTokens(refreshToken);
    res.status(200).json({
      message: "Tokens refreshed",
      user,
      newAccessToken,
      newRefreshToken,
      firebaseCustomToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postAppleLogin,
  postKakaoLogin,
  postGoogleLogin,
  postRefresh,
};
