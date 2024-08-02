const express = require("express");
// const { getMyInfo } = require("../controllers/userController");
const {
  getMyPosts,
  postMyPost,
  getAllPosts,
  getThisPost,
} = require("../controllers/postController");
// const { postNewRoom, getRoom } = require("../controllers/roomController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// router.get("/user", authenticateToken, getMyInfo); // 회원 정보
// router.put("/user", authenticateToken, putMyInfo); // 회원 정보 수정
// router.delete("/user", authenticateToken, deleteMyInfo); // 회원 탈퇴

router.get("/user/posts", authenticateToken, getMyPosts); // 내가 쓴 게시물

router.post("/posts", authenticateToken, postMyPost); // 게시글 작성
router.get("/posts", getAllPosts); // 전체 게시글 가져오기
router.get("/posts/:postId", getThisPost); // 게시글 조회
// router.put("/posts/:postId", authenticateToken, putMyPost); // 내 게시글 수정
// router.delete("/posts/:postId", authenticateToken, deleteMyPost); // 내 게시글 삭제

module.exports = router;
