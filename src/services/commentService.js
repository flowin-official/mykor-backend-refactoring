const {
  createComment,
  updateComment,
  deleteComment,
  increaseCommentLike,
  decreaseCommentLike,
  findCommentsByPostId,
} = require("../repositories/commentRepository");
const {
  createCommentLike,
  deleteCommentLike,
} = require("../repositories/commentLikeRepository");

async function newComment(userId, postId, content) {
  try {
    const comment = await createComment(userId, postId, content);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function modifyComment(commentId, content) {
  try {
    const comment = await updateComment(commentId, content);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function removeComment(commentId) {
  try {
    const comment = await deleteComment(commentId);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function likeComment(commentId, userId) {
  try {
    await increaseCommentLike(commentId); // 좋아요 증가
    const comment = await createCommentLike(commentId, userId);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function dislikeComment(commentId, userId) {
  try {
    await decreaseCommentLike(commentId); // 좋아요 감소
    const comment = await deleteCommentLike(commentId, userId);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function commentsOnThisPost(postId) {
  try {
    const comments = await findCommentsByPostId(postId);
    return comments;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  newComment,
  modifyComment,
  removeComment,
  likeComment,
  dislikeComment,
  commentsOnThisPost,
};
