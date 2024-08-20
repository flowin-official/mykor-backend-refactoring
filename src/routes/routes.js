const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createAccessToken } = require("../utils/jwt");
const {
  postKakaoLogin,
  postRefresh,
} = require("../controllers/authController");
const { postContact } = require("../controllers/contactController");
const {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
  getUserInfo,
} = require("../controllers/userController");
const {
  getPostsInRange,
  getMyPosts,
  postMyPost,
  getThisPost,
  putMyPost,
  deleteMyPost,
  postLikePost,
  deleteLikePost,
  getPostsSearch,
} = require("../controllers/postController");
const {
  postMyComment,
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
} = require("../controllers/commentController");
const { getLocations } = require("../controllers/locationController");
const { getTags } = require("../controllers/tagController");

const setupRoutes = (app) => {
  const router = express.Router();

  // 테스트용 액세스토큰 발급 라우트
  router.post("/test", (req, res) => {
    const userId = "66c2f9ac6cbec92da7aa3182";
    const accessToken = createAccessToken({ id: userId });
    const user = {
      _id: userId,
      userLocation: "66c010709cab1badf1eade78",
      userName: "test",
      kakaoUserCode: "1",
    };
    res.json({
      message: "test user",
      user,
      accessToken,
    });
  });

  router.post("/test2", (req, res) => {
    const userId = "66c2f9df6cbec92da7aa3183";
    const accessToken = createAccessToken({ id: userId });
    const user = {
      _id: userId,
      userLocation: "66c010709cab1badf1eade7a",
      userName: "test2",
      kakaoUserCode: "2",
    };
    res.json({
      message: "test user2",
      user,
      accessToken,
    });
  });

  // unprotected routes
  router.post("/login/kakao", postKakaoLogin); // 카카오 로그인(회원가입)
  router.post("/refresh", postRefresh); // 토큰 재발급

  router.post("/contact", postContact); // 지역 문의하기

  router.get("/posts", getPostsInRange); // 범위 내 게시글 가져오기(페이지네이션)
  router.get("/post/:postId", getThisPost); // 게시글 조회
  router.get("/posts/search", getPostsSearch); // 검색 게시글 가져오기

  router.get("/user/:userId", getUserInfo); // 유저 정보 가져오기(비로그인으로 접근가능한 정보)

  router.get("/locations", getLocations); // 지역 정보 가져오기

  router.get("/tags", getTags); // 태그 정보 가져오기

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
