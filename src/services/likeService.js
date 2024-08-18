const {
  createPostLike,
  deletePostLike,
  findPostLike,
} = require("../repositories/postLikeRepository");
const {
  createCommentLike,
  deleteCommentLike,
  findCommentLike,
} = require("../repositories/commentLikeRepository");

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

async function isLikedPost(postId, userId) {
  try {
    const postLike = await findPostLike(postId, userId);
    if (postLike) return true;
    return false;
  } catch (error) {
    throw error;
  }
}

async function isLikedComment(commentId, userId) {
  try {
    const commentLike = await findCommentLike(commentId, userId);
    if (commentLike) return true;
    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  isLikedPost,
  isLikedComment,
};
