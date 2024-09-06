const axios = require("axios");
const {
  createKakaoUser,
  createAppleUser,
  findUserByKakaoUserCode,
  findUserByAppleUserCode,
  findUserById,
} = require("../repositories/userRepository");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  parseJwt,
} = require("../utils/jwt");
const {
  saveRefreshToken,
  findRefreshToken,
} = require("../repositories/refreshTokenRepository");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const qs = require("qs");
const logger = require("../utils/logger");

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

async function acquireAppleAuthTokenResponse(authCode) {
  const appleAlgorithm = process.env.APPLE_ALG;
  const appleAuthKey = fs.readFileSync(process.env.APPLE_AUTH_KEY_FILE, "utf8");
  const appleBundleID = process.env.APPLE_BUNDLE_ID;
  const appleIssuer = process.env.APPLE_TEAM_ID;
  const appleKeyID = process.env.APPLE_KEY_ID;

  try {
    // Apple Login에 필요한 Client Secret Token 생성
    const clientSecret = jwt.sign(
      {
        iss: appleIssuer,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1시간 유효
        aud: "https://appleid.apple.com",
        sub: appleBundleID,
      },
      appleAuthKey,
      {
        algorithm: appleAlgorithm,
        header: {
          alg: appleAlgorithm,
          kid: appleKeyID,
        },
      }
    );

    // Apple 서버로부터 access_token을 가져오기 위한 요청 데이터
    const tokenRequestBody = {
      grant_type: "authorization_code",
      code: authCode,
      client_id: appleBundleID, // Apple Developer Console에 등록된 App ID
      client_secret: clientSecret, // Apple에서 생성한 Client Secret
      redirect_uri: "", // Apple 로그인 리디렉션 URI
    };

    const tokenResponse = await axios.post(
      "https://appleid.apple.com/auth/token",
      qs.stringify(tokenRequestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return tokenResponse.data;

  } catch (error) {
    throw error;
  }
}

async function revokeAppleAuthTokenResponse(access_token) {
  const appleAlgorithm = process.env.APPLE_ALG;
  const appleAuthKey = fs.readFileSync(process.env.APPLE_AUTH_KEY_FILE, "utf8");
  const appleBundleID = process.env.APPLE_BUNDLE_ID;
  const appleIssuer = process.env.APPLE_TEAM_ID;
  const appleKeyID = process.env.APPLE_KEY_ID;

  try {
    // Apple Login에 필요한 Client Secret Token 생성
    const clientSecret = jwt.sign(
      {
        iss: appleIssuer,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1시간 유효
        aud: "https://appleid.apple.com",
        sub: appleBundleID,
      },
      appleAuthKey,
      {
        algorithm: appleAlgorithm,
        header: {
          alg: appleAlgorithm,
          kid: appleKeyID,
        },
      }
    );
    
    const url = 'https://appleid.apple.com/auth/revoke';

    const params = new URLSearchParams();
    params.append('client_id', appleBundleID);
    params.append('client_secret', clientSecret);
    params.append('token', access_token);
    params.append('token_type_hint', 'access_token');

    const response = await axios.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;

  } catch (error) {
    throw error;
  }
}

async function loginAppleUser(authCode) {
  try{
    const { access_token, refresh_token, id_token } = await acquireAppleAuthTokenResponse(authCode);

    // id_token에서 user_id를 추출
    const userInfo = parseJwt(id_token);

    // 여기서 userInfo.sub가 Apple의 user_id입니다.
    const userId = userInfo.sub;

    // 유저 코드를 기반으로 유저 찾기
    let user = await findUserByAppleUserCode(userId);

    // 유저가 없으면 새로 생성
    if (!user) {
      user = await createAppleUser(userId);
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
}

async function deleteAppleUser(authCode) {
  try {
    const { access_token, refresh_token, id_token } = await acquireAppleAuthTokenResponse(authCode);

    // id_token에서 user_id를 추출
    const userInfo = parseJwt(id_token);

    // 여기서 userInfo.sub가 Apple의 user_id입니다.
    const userId = userInfo.sub;

    // 유저 코드를 기반으로 유저 찾기
    let user = await findUserByAppleUserCode(userId);

    // 유저가 없으면 에러
    if (!user) {
      throw new Error("user not exists!");
    }

    return revokeAppleAuthTokenResponse(access_token);

  } catch (error) {
    throw error;
  }
}

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
    res.status(500).json({ error: "카카오에서 인증하는데 실패했습니다." });
  }
}

async function refreshNewTokens(refreshToken) {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.id;

    const savedRefreshToken = await findRefreshToken(userId);
    if (savedRefreshToken !== refreshToken)
      throw new Error("Invalid refresh token");

    const user = await findUserById(userId);

    const newAccessToken = createAccessToken({ id: userId });
    const newRefreshToken = createRefreshToken({ id: userId });

    // redis에 저장된 리프레시 토큰 갱신
    await saveRefreshToken(userId, newRefreshToken);

    return { user, newAccessToken, newRefreshToken };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginAppleUser,
  loginKakaoUser,
  refreshNewTokens,
  deleteAppleUser,
};
