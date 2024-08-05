const {
  newComment,
  modifyComment,
  removeComment,
  likeComment,
  dislikeComment,
  commentsOnThisPost,
} = require("../services/commentService");

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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
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
 *       500:
 *         description: 서버 에러
 */
async function postMyComment(req, res) {
  const userId = req.userId;
  const { postId, content } = req.body;
  try {
    const comment = await newComment(userId, postId, content);
    res.status(200).json({
      message: "Comment created",
      comment,
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *       500:
 *         description: 서버 에러
 */
async function putMyComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  try {
    const comment = await modifyComment(commentId, content);
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *                 comment:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function deleteMyComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await removeComment(commentId);
    res.status(200).json({
      message: "Comment deleted",
      comment,
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *                 comment:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function postLikeComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await likeComment(commentId, userId);
    res.status(200).json({
      message: "Comment liked",
      comment,
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *                 comment:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function deleteLikeComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await dislikeComment(commentId, userId);
    res.status(200).json({
      message: "Comment unliked",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /post/{postId}/comments:
 *   get:
 *     summary: 특정 게시글의 모든 댓글 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
async function getCommentsOnThisPost(req, res) {
  const postId = req.params.postId;
  try {
    const comments = await commentsOnThisPost(postId);
    res.status(200).json({
      message: "Comments found",
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postMyComment,
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
  getCommentsOnThisPost,
};
