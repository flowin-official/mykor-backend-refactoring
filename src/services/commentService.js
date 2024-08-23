const {
  createComment,
  updateComment,
  deleteComment,
  findCommentsByPostId,
  findCommentById,
} = require("../repositories/commentRepository");
const {
  increasePostComment,
  decreasePostComment,
  findPostById,
} = require("../repositories/postRepository");
const { findUserById } = require("../repositories/userRepository");

async function newComment(userId, postId, content) {
  try {
    // 유저 및 게시글 검증
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const comment = await createComment(user, post, content);
    await increasePostComment(post._id); // 게시글의 댓글 카운트 증가

    return comment;
  } catch (error) {
    throw error;
  }
}

async function modifyMyComment(commentId, content, userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // 댓글 작성자 확인
    if (comment.author.toString() !== user._id.toString()) {
      throw new Error("댓글 작성자가 아닙니다");
    } else {
      comment = await updateComment(comment, content);
      return comment;
    }
  } catch (error) {
    throw error;
  }
}

async function removeMyComment(commentId, userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // 댓글 작성자 확인
    if (comment.author.toString() !== user._id.toString()) {
      throw new Error("댓글 작성자가 아닙니다");
    } else {
      await decreasePostComment(comment.post); // 게시글의 댓글 카운트 감소
      comment = await deleteComment(comment);
    }
  } catch (error) {
    throw error;
  }
}

async function commentsOnThisPost(postId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const comments = await findCommentsByPostId(post);
    return comments;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  newComment,
  modifyMyComment,
  removeMyComment,
  commentsOnThisPost,
};
