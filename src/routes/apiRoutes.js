// protected routes를 정의한 파일
const express = require("express");
const {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
} = require("../controllers/apiControllers/userController");
const {
  getMyPosts,
  postMyPost,
  getAllPosts,
  getLocationPosts,
  getLocationTagPosts,
  getThisPost,
  putMyPost,
  deleteMyPost,
} = require("../controllers/apiControllers/postController");
// const {
//   postMyComment,
//   putMyComment,
//   deleteMyComment,
// } = require("../controllers/commentController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user", authenticateToken, getMyInfo); // 회원 정보
router.put("/user", authenticateToken, putMyInfo); // 회원 정보 수정
router.delete("/user", authenticateToken, deleteMyInfo); // 회원 탈퇴

router.get("/user/posts", authenticateToken, getMyPosts); // 내가 쓴 게시물

router.post("/posts", authenticateToken, postMyPost); // 게시글 작성
router.get("/posts", getAllPosts); // 전체 게시글 가져오기
router.get("/posts/:location", getLocationPosts); // 지역별 게시글 가져오기
router.get("/posts/:location/:tag", getLocationTagPosts); // 지역별 태그된 게시물 가져오기
router.get("/posts/:postId", getThisPost); // 게시글 조회
router.put("/posts/:postId", authenticateToken, putMyPost); // 내 게시글 수정
router.delete("/posts/:postId", authenticateToken, deleteMyPost); // 내 게시글 삭제

// router.post("/like", authenticateToken, postLike); // 게시글 좋아요
// router.delete("/like", authenticateToken, deleteLike); // 게시글 좋아요 취소

// router.post("/comment", authenticateToken, postMyComment); // 댓글 작성
// router.put("/comment", authenticateToken, putMyComment); // 댓글 수정
// router.delete("/comment", authenticateToken, deleteMyComment); // 댓글 삭제

// router.post("/comment/like", authenticateToken, commentLike); // 댓글 좋아요
// router.delete("/comment/like", authenticateToken, commentDeleteLike); // 댓글 좋아요 취소

module.exports = router;
