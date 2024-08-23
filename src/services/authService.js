const axios = require("axios");
const {
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
  const redirectUri = process.env.NATIVE_REDIRECT_URI;

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
          code: authCode,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // 카카오 서버로부터 받은 액세스 토큰
    const { access_token } = tokenResponse.data;

    // 카카오 서버로부터 받은 액세스 토큰을 기반으로 유저 코드 요청
    try {
      const userResponse = await axios.get(
        "https://kapi.kakao.com/v1/user/access_token_info",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // 유저 코드
      const { id } = userResponse.data;

      try {
        // 유저 코드를 기반으로 유저 찾기
        let user = await findUserByKakaoUserCode(id);

        // 유저가 없으면 새로 생성
        if (!user) {
          user = await createKakaoUser(id);
        }

        // user._id는 생성된 유저의 db상 id임
        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        // redis에 리프레시 토큰 저장
        await saveRefreshToken(user._id, refreshToken);

        return { user, accessToken, refreshToken };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate with Kakao." });
  }
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

    // redis에 저장된 리프레시 토큰 갱신
    await saveRefreshToken(userId, newRefreshToken);

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginKakaoUser,
  refreshNewTokens,
};
