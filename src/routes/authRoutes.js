// opened routes를 정의한 파일
const express = require("express");
const {
  //   postSignup,
  //   postLogin,
  postKakaoLogin,
  postRefresh,
} = require("../controllers/authController");
const { postContact } = require("../controllers/contactController");

const router = express.Router();

// router.post("/signup", postSignup);
// router.post("/login", postLogin);
router.post("/login/kakao", postKakaoLogin);
router.post("/refresh", postRefresh);

router.post("/contact", postContact); // 지역 문의하기

module.exports = router;
