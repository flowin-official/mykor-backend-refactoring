const express = require("express");
const {
  postKakaoLogin,
  postRefresh,
} = require("../controllers/authController");
const { postContact } = require("../controllers/contactController");
const {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
} = require("../controllers/userController");
const {
  getMyPosts,
  postMyPost,
  getAllPosts,
  getLocationPosts,
  getLocationTagPosts,
  getThisPost,
  putMyPost,
  deleteMyPost,
} = require("../controllers/postController");
const authenticateToken = require("../middlewares/authMiddleware");

const setupRoutes = (app) => {
  const router = express.Router();

  // unprotected routes
  router.post("/login/kakao", postKakaoLogin); // 카카오 로그인(회원가입)
  router.post("/refresh", postRefresh); // 토큰 재발급

  router.post("/contact", postContact); // 지역 문의하기

  router.get("/posts", getAllPosts); // 전체 게시글 가져오기
  router.get("/posts/:location", getLocationPosts); // 지역별 게시글 가져오기
  router.get("/posts/:location/:tag", getLocationTagPosts); // 지역별 태그된 게시물 가져오기
  router.get("/posts/:postId", getThisPost); // 게시글 조회

  // protected routes
  router.get("/user", authenticateToken, getMyInfo); // 회원 정보
  router.put("/user", authenticateToken, putMyInfo); // 회원 정보 수정
  router.delete("/user", authenticateToken, deleteMyInfo); // 회원 탈퇴

  router.post("/posts", authenticateToken, postMyPost); // 게시글 작성
  router.get("/user/posts", authenticateToken, getMyPosts); // 내가 쓴 게시물
  router.put("/posts/:postId", authenticateToken, putMyPost); // 내 게시글 수정
  router.delete("/posts/:postId", authenticateToken, deleteMyPost); // 내 게시글 삭제

  app.use("/mykor/api/v1", router);
};

module.exports = setupRoutes;
