const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createAccessToken } = require("../utils/jwt");
const {
  postKakaoLogin,
  postAppleLogin,
  postGoogleLogin,
  postRefresh,
} = require("../controllers/authController");
const { postContact } = require("../controllers/contactController");
const {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
  getUserInfo,
  postBlockUser,
} = require("../controllers/userController");
const {
  getPostsInRange,
  postMyPost,
  getThisPost,
  putMyPost,
  deleteMyPost,
  postLikePost,
  deleteLikePost,
  getPostsSearch,
  postReportPost,
  getThisPostWithLogin,
  getPostsInRangeWithLogin,
  getPostsSearchWithLogin,
  getMyPosts,
  getMyPostLikes,
  getUserPosts,
} = require("../controllers/postController");
const {
  postMyComment,
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
  postReportComment,
  getMyComments,
  getUserComments,
} = require("../controllers/commentController");
const { getLocations } = require("../controllers/locationController");
const { getTags } = require("../controllers/tagController");
const {
  getMyNotifications,
  getNotification,
} = require("../controllers/notificationController");
const { postDummyPost, deleteDummyPost } = require("../dummy/dummyPost");
const {
  postDummyComment,
  deleteDummyComment,
} = require("../dummy/dummyComment");
const {
  postChatMessage,
  getChatMessages,
} = require("../controllers/chatController");

const setupRoutes = (app) => {
  const router = express.Router();

  // 테스트용 액세스토큰 발급 라우트
  router.post("/test", (req, res) => {
    const userId = "66c2f9ac6cbec92da7aa3182";
    const accessToken = createAccessToken({ id: userId });
    const user = {
      _id: userId,
      location: "66c010709cab1badf1eade78",
      nickname: "test",
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
      location: "66c010709cab1badf1eade7a",
      nickname: "test2",
      kakaoUserCode: "2",
    };
    res.json({
      message: "test user2",
      user,
      accessToken,
    });
  });

  // 헬스체크 라우트
  router.get("/healthcheck", (req, res) => {
    res.status(200).json({
      message: "Server is running",
    });
  });

  router.post("/dummy/post", postDummyPost); // 게시글 더미 데이터 생성
  router.delete("/dummy/post", deleteDummyPost); // 게시글 더미 데이터 삭제

  router.post("/dummy/comment", postDummyComment); // 댓글 더미 데이터 생성
  router.delete("/dummy/comment", deleteDummyComment); // 댓글 더미 데이터 삭제

  router.post("/login/kakao", postKakaoLogin); // 카카오 로그인(회원가입)
  router.post("/login/apple", postAppleLogin); // 애플 로그인(회원가입)
  router.post("/login/google", postGoogleLogin); // 구글 로그인(회원가입)

  router.post("/refresh", postRefresh); // 토큰 재발급

  router.post("/contact", postContact); // 지역 문의하기

  router.get("/locations", getLocations); // 지역 정보 가져오기

  router.get("/tags", getTags); // 태그 정보 가져오기

  router.get("/user", authenticateToken, getMyInfo); // 내 정보
  router.put("/user", authenticateToken, putMyInfo); // 내 정보 수정
  router.delete("/user", authenticateToken, deleteMyInfo); // 회원 탈퇴
  router.get("/my/posts", authenticateToken, getMyPosts);
  router.get("/my/postlikes", authenticateToken, getMyPostLikes);
  router.get("/my/comments", authenticateToken, getMyComments);

  router.get("/user/:userId", authenticateToken, getUserInfo); // 다른 유저 정보 가져오기
  router.get("/user/:userId/posts", authenticateToken, getUserPosts); // 다른 유저 게시글 가져오기
  router.get("/user/:userId/comments", authenticateToken, getUserComments); // 다른 유저 댓글 가져오기

  router.post("/user/:blockedUserId/block", authenticateToken, postBlockUser); // 유저 차단

  router.get("/post/:postId", getThisPost); // 게시글 조회(비회원)
  router.get("/post/:postId/user", authenticateToken, getThisPostWithLogin); // 게시글 조회(회원, 댓글 차단 반영)
  router.post("/post", authenticateToken, postMyPost); // 게시글 작성
  router.put("/post/:postId", authenticateToken, putMyPost); // 내 게시글 수정
  router.delete("/post/:postId", authenticateToken, deleteMyPost); // 내 게시글 삭제

  router.post("/post/:postId/like", authenticateToken, postLikePost); // 게시글 좋아요
  router.delete("/post/:postId/like", authenticateToken, deleteLikePost); // 게시글 좋아요 취소

  router.post("/post/:postId/report", authenticateToken, postReportPost); // 게시글 신고

  router.get("/posts", getPostsInRange); // 범위 내 게시글 가져오기(비회원)
  router.get("/posts/user", authenticateToken, getPostsInRangeWithLogin); // 범위 내 게시글 가져오기(회원, 게시글 차단 반영)

  router.get("/posts/search", getPostsSearch); // 검색 게시글 가져오기(비회원)
  router.get("/posts/search/user", authenticateToken, getPostsSearchWithLogin); // 검색(회원, 게시글 차단 반영)

  router.get("/notifications", authenticateToken, getMyNotifications); // 알림 읽음 처리
  router.get("/notification", authenticateToken, getNotification); // 알림 여부 확인

  router.put("/comment/:commentId", authenticateToken, putMyComment); // 내 댓글 수정
  router.post("/comment", authenticateToken, postMyComment); // 게시물에 댓글 작성
  router.delete("/comment/:commentId", authenticateToken, deleteMyComment); // 내 댓글 삭제

  router.post("/comment/:commentId/like", authenticateToken, postLikeComment); // 댓글 좋아요
  router.delete(
    "/comment/:commentId/like",
    authenticateToken,
    deleteLikeComment
  ); // 댓글 좋아요 취소
  router.post(
    "/comment/:commentId/report",
    authenticateToken,
    postReportComment
  ); // 댓글 신고

  router.post("/message", authenticateToken, postChatMessage);
  router.get("/messages/:roomId", authenticateToken, getChatMessages);

  // 기본 라우트 설정
  app.use("/mykor/api/v1", router);
};

module.exports = setupRoutes;
