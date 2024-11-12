const {
  loginAppleUser,
  loginKakaoUser,
  loginGoogleUser,
  refreshNewTokens,
} = require("../services/authService");
const { generateGetPresignedUrl } = require("../services/s3Service");

async function postKakaoLogin(req, res) {
  const { authCode, fcmToken } = req.body;
  try {
    const { user, accessToken, refreshToken, firebaseCustomToken } =
      await loginKakaoUser(authCode, fcmToken);

    // user객체의 프로필 이미지 presigned url로 변환 후 key, url 순서쌍으로 저장
    let profileImageData = null;
    if (user.profileImage) {
      profileImageData = {
        key: user.profileImage,
        url: await generateGetPresignedUrl(user.profileImage),
      };
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: { ...user, profileImage: profileImageData },
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

    // user객체의 프로필 이미지 presigned url로 변환 후 key, url 순서쌍으로 저장
    let profileImageData = null;
    if (user.profileImage) {
      profileImageData = {
        key: user.profileImage,
        url: await generateGetPresignedUrl(user.profileImage),
      };
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: { ...user, profileImage: profileImageData },
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

    // user객체의 프로필 이미지 presigned url로 변환 후 key, url 순서쌍으로 저장
    let profileImageData = null;
    if (user.profileImage) {
      profileImageData = {
        key: user.profileImage,
        url: await generateGetPresignedUrl(user.profileImage),
      };
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: { ...user, profileImage: profileImageData },
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
