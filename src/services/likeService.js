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
  findPostById,
  increasePostLike,
  decreasePostLike,
} = require("../repositories/postRepository");
const {
  findCommentById,
  increaseCommentLike,
  decreaseCommentLike,
} = require("../repositories/commentRepository");
const { findUserById } = require("../repositories/userRepository");

async function likePost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    let postLike = await findPostLike(post, user);
    if (postLike) {
      throw new Error("이미 좋아요한 게시글입니다.");
    } else {
      postLike = await createPostLike(post, user);
      await increasePostLike(post); // 게시글 좋아요 수 증가
    }

    return postLike;
  } catch (error) {
    throw error;
  }
}

async function dislikePost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const postLike = await findPostLike(post, user);
    if (!postLike) {
      throw new Error("좋아요하지 않은 게시글입니다.");
    } else {
      await deletePostLike(post, user);
      await decreasePostLike(post); // 게시글 좋아요 수 감소
    }
  } catch (error) {
    throw error;
  }
}

async function likeComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    let commentLike = await findCommentLike(comment, user);
    if (commentLike) {
      throw new Error("이미 좋아요한 댓글입니다.");
    } else {
      commentLike = await createCommentLike(comment, user);
      await increaseCommentLike(comment); // 댓글 좋아요 수 증가
    }
    return commentLike;
  } catch (error) {
    throw error;
  }
}

async function dislikeComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const commentLike = await findCommentLike(comment, user);
    if (!commentLike) {
      throw new Error("좋아요하지 않은 댓글입니다.");
    } else {
      await deleteCommentLike(comment, user);
      await decreaseCommentLike(comment); // 댓글 좋아요 수 감소
    }
  } catch (error) {
    throw error;
  }
}

async function isLikedPost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const postLike = await findPostLike(post, user);
    if (postLike) return true;
    return false;
  } catch (error) {
    throw error;
  }
}

async function isLikedComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const commentLike = await findCommentLike(comment, user);
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
