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
} = require("../repositories/postRepository");

async function newComment(userId, postId, content) {
  try {
    const comment = await createComment(userId, postId, content);
    await increasePostComment(postId); // 게시글의 댓글 카운트 증가

    return comment;
  } catch (error) {
    throw error;
  }
}

async function modifyMyComment(commentId, content, userId) {
  try {
    let comment = await findCommentById(commentId);
    // 댓글 작성자 확인
    if (comment.userId._id !== userId) {
      throw new Error("You are not the author of this comment");
    }
    comment = await updateComment(commentId, content);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function removeMyComment(commentId, userId) {
  try {
    let comment = await findCommentById(commentId);
    // 댓글 작성자 확인
    if (comment.userId._id !== userId) {
      throw new Error("You are not the author of this comment");
    }
    await deleteComment(commentId);
    await decreasePostComment(comment.postId); // 게시글의 댓글 카운트 감소
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
  modifyMyComment,
  removeMyComment,
  commentsOnThisPost,
};
