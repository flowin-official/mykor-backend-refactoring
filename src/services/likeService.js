const {
  createPostLike,
  deletePostLike,
} = require("../repositories/postLikeRepository");
const {
  createCommentLike,
  deleteCommentLike,
} = require("../repositories/commentRepository");

async function likePost(postId, userId) {
  try {
    const postLike = await createPostLike(postId, userId);
    return postLike;
  } catch (error) {
    throw error;
  }
}

async function unlikePost(postId, userId) {
  try {
    await deletePostLike(postId, userId);
  } catch (error) {
    throw error;
  }
}

async function likeComment(commentId, userId) {
  try {
    const commentLike = await createCommentLike(commentId, userId);
    return commentLike;
  } catch (error) {
    throw error;
  }
}

async function unlikeComment(commentId, userId) {
  try {
    await deleteCommentLike(commentId, userId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
};
