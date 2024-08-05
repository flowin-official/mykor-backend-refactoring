const CommentLike = require("../models/commentLike");

const createCommentLike = async (commentId, userId) => {
  try {
    const commentLike = await CommentLike.create({
      comment_id: commentId,
      user_id: userId,
    });
    return commentLike;
  } catch (error) {
    throw error;
  }
};

const deleteCommentLike = async (commentId, userId) => {
  try {
    await CommentLike.findOneAndDelete({
      comment_id: commentId,
      user_id: userId,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCommentLike,
  deleteCommentLike,
};
