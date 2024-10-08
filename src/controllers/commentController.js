const {
  newComment,
  modifyMyComment,
  removeMyComment,
  myComments,
  userComments,
} = require("../services/commentService");
const { reportComment } = require("../services/reportService");
const { likeComment, dislikeComment } = require("../services/likeService");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               commentId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function postMyComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const { postId, commentId, content } = req.body;
  try {
    const comment = await newComment(userId, postId, commentId, content);
    res.status(200).json({
      message: "Comment created",
      comment: {
        ...comment.toObject(),
        post: comment.post._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /comment/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function putMyComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  try {
    const comment = await modifyMyComment(commentId, content, userId);
    res.status(200).json({
      message: "Comment updated",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function deleteMyComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    await removeMyComment(commentId, userId);
    res.status(200).json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /comment/{commentId}/like:
 *   post:
 *     summary: 댓글 좋아요
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commentLike:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function postLikeComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const commentLike = await likeComment(commentId, userId);
    res.status(200).json({
      message: "Comment liked",
      commentLike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /comment/{commentId}/like:
 *   delete:
 *     summary: 댓글 좋아요 취소
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function deleteLikeComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    await dislikeComment(commentId, userId);
    res.status(200).json({
      message: "Comment unliked",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /comment/{commentId}/report:
 *   post:
 *     summary: 댓글 신고
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 신고완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function postReportComment(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const commentId = req.params.commentId;
  const { reason, content } = req.body;
  try {
    const comment = await reportComment(commentId, userId, reason, content);
    res.status(200).json({
      message: "Comment reported",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /my/comments:
 *   get:
 *     summary: 내 댓글 가져오기
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: query
 *         name: lastCommentId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 댓글 ID
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 댓글 수
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 내 댓글 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 countAllComments:
 *                   type: integer
 *                 comments:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function getMyComments(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const lastCommentId = req.query.lastCommentId;
  const size = req.query.size;
  try {
    const { countAllComments, comments } = await myComments(
      userId,
      lastCommentId,
      size
    );
    res.status(200).json({
      message: "Comments found",
      countAllComments,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user/{userId}/comments:
 *   get:
 *     summary: 유저 댓글 가져오기
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: query
 *         name: lastCommentId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 댓글 ID
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 댓글 수
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 내 댓글 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 countAllComments:
 *                   type: integer
 *                 comments:
 *                   type: object
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function getUserComments(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.params.userId; // 헤더 토큰의 userId가 아니라 URL의 userId
  const lastCommentId = req.query.lastCommentId;
  const size = req.query.size;
  try {
    const { countAllComments, comments } = await userComments(
      userId,
      lastCommentId,
      size
    );
    res.status(200).json({
      message: "Comments found",
      countAllComments,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyComments,
  getUserComments,

  postMyComment,
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
  postReportComment,
};
