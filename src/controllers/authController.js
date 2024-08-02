const {
  // registerUser,
  // loginUser,
  loginKakaoUser,
  refreshNewTokens,
} = require("../services/authService");

// async function postSignup(req, res) {
//   const { email, password, name } = req.body;
//   try {
//     const user = await registerUser(email, password, name);
//     res.status(201).json({
//       message: "User created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function postLogin(req, res) {
//   const { email, password } = req.body;
//   try {
//     const tokens = await loginUser(email, password);
//     res.status(200).json({
//       message: "User logged in successfully",
//       tokens,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function postKakaoLogin(req, res) {
  const { kakaoUserCode, userName } = req.body;
  try {
    const tokens = await loginKakaoUser(kakaoUserCode, userName);
    res.status(200).json({
      message: "User logged in successfully",
      tokens,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
