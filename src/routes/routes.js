const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
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
  // getThisPost,
  putMyPost,
  deleteMyPost,
  postLikePost,
  deleteLikePost,
} = require("../controllers/postController");
const {
  postMyComment,
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
  getCommentsOnThisPost,
} = require("../controllers/commentController");

const setupRoutes = (app) => {
  const router = express.Router();

  // unprotected routes
  router.post("/login/kakao", postKakaoLogin); // 카카오 로그인(회원가입)
  router.post("/refresh", postRefresh); // 토큰 재발급

  router.post("/contact", postContact); // 지역 문의하기

  router.get("/posts", getAllPosts); // 전체 게시글 가져오기
  router.get("/posts/:location", getLocationPosts); // 지역별 게시글 가져오기
  router.get("/posts/:location/:tag", getLocationTagPosts); // 지역별 태그된 게시물 가져오기
  router.get("/post/:postId/comments", getCommentsOnThisPost); // 게시물의 댓글 가져오기(게시글 조회)
  // router.get("/post/:postId", getThisPost); // 게시글 조회

  // protected routes
  router.get("/user", authenticateToken, getMyInfo); // 회원 정보
  router.put("/user", authenticateToken, putMyInfo); // 회원 정보 수정
  router.delete("/user", authenticateToken, deleteMyInfo); // 회원 탈퇴

  router.post("/post", authenticateToken, postMyPost); // 게시글 작성
  router.get("/user/posts", authenticateToken, getMyPosts); // 내가 쓴 게시물 보기
  router.put("/post/:postId", authenticateToken, putMyPost); // 내 게시글 수정
  router.delete("/post/:postId", authenticateToken, deleteMyPost); // 내 게시글 삭제

  router.post("/post/:postId/like", authenticateToken, postLikePost); // 게시글 좋아요
  router.delete("/post/:postId/like", authenticateToken, deleteLikePost); // 게시글 좋아요 취소

  router.post("/comment", authenticateToken, postMyComment); // 게시물에 댓글 작성
  router.put("/comment/:commentId", authenticateToken, putMyComment); // 내 댓글 수정
  router.delete("/comment/:commentId", authenticateToken, deleteMyComment); // 내 댓글 삭제

  router.post("/comment/:commentId/like", authenticateToken, postLikeComment); // 댓글 좋아요
  router.delete(
    "/comment/:commentId/like",
    authenticateToken,
    deleteLikeComment
  ); // 댓글 좋아요 취소

  // 기본 라우트 설정
  app.use("/mykor/api/v1", router);
};

module.exports = setupRoutes;
