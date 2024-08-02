const express = require("express");
const {
  //   postSignup,
  //   postLogin,
  postKakaoLogin,
  postRefresh,
} = require("../controllers/authController");

const router = express.Router();

// router.post("/signup", postSignup);
// router.post("/login", postLogin);
router.post("/login/kakao", postKakaoLogin);
router.post("/refresh", postRefresh);

module.exports = router;
