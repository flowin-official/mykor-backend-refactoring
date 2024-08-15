const {
  // createUser,
  // findUserByEmail,
  createKakaoUser,
  findUserByKakaoUserCode,
} = require("../repositories/userRepository");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const {
  saveRefreshToken,
  findRefreshToken,
} = require("../repositories/refreshTokenRepository");

// async function registerUser(email, password, name) {
//   try {
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       throw new Error("Email already in use");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await createUser(email, hashedPassword, name);
//     return user;
//   } catch (error) {
//     throw error;
//   }
// }

// async function loginUser(email, password) {
//   try {
//     const user = await findUserByEmail(email);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new Error("Invalid password");
//     }

//     const accessToken = createAccessToken({ id: user._id });
//     const refreshToken = createRefreshToken({ id: user._id });

//     await saveRefreshToken(user._id, refreshToken);

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw error;
//   }
// }

async function loginKakaoUser(authCode) {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  const redirectUri = process.env.ANDROID_REDIRECT_URI;

  // 카카오 서버 측에 authCode를 통해 카카오 인증을 요청하고 토큰 받기
  try {
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;
    console.log(tokenResponse);
    res.json({ access_token });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate with Kakao." });
  }

  // try {
  //   let user = await findUserByKakaoUserCode(kakaoUserCode);

  //   // 유저가 없으면 새로 생성
  //   if (!user) {
  //     user = await createKakaoUser(kakaoUserCode, userName);
  //   }

  //   const accessToken = createAccessToken({ id: user._id });
  //   const refreshToken = createRefreshToken({ id: user._id });
  //   await saveRefreshToken(user._id, refreshToken);

  //   return { user, accessToken, refreshToken };
  // } catch (error) {
  //   throw error;
  // }
}

async function refreshNewTokens(refreshToken) {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.id;

    const savedRefreshToken = await findRefreshToken(userId);
    if (savedRefreshToken !== refreshToken)
      throw new Error("Invalid refresh token");

    const newAccessToken = createAccessToken({ id: userId });
    const newRefreshToken = createRefreshToken({ id: userId });

    await saveRefreshToken(userId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  // registerUser,
  // loginUser,
  loginKakaoUser,
  refreshNewTokens,
};
