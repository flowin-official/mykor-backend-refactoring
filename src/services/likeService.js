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
const {
  increasePostLike,
  decreasePostLike,
} = require("../repositories/postRepository");

async function likePost(postId, userId) {
  try {
    let postLike = await findPostLike(postId, userId);
    if (postLike) {
      throw new Error("이미 좋아요한 게시글입니다.");
    }
    postLike = await createPostLike(postId, userId);

    await increasePostLike(postId); // 좋아요 수 증가

    return postLike;
  } catch (error) {
    throw error;
  }
}

async function dislikePost(postId, userId) {
  try {
    const postLike = await findPostLike(postId, userId);
    if (!postLike) {
      throw new Error("좋아요하지 않은 게시글입니다.");
    }

    await decreasePostLike(postId); // 좋아요 수 감소

    await deletePostLike(postId, userId);
  } catch (error) {
    throw error;
  }
}

async function likeComment(commentId, userId) {
  try {
    let commentLike = await findCommentLike(commentId, userId);
    if (commentLike) {
      throw new Error("이미 좋아요한 댓글입니다.");
    }

    commentLike = await createCommentLike(commentId, userId);
    return commentLike;
  } catch (error) {
    throw error;
  }
}

async function dislikeComment(commentId, userId) {
  try {
    const commentLike = await findCommentLike(commentId, userId);
    if (!commentLike) {
      throw new Error("좋아요하지 않은 댓글입니다.");
    }

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
  dislikePost,
  likeComment,
  dislikeComment,
  isLikedPost,
  isLikedComment,
};
