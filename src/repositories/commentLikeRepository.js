const CommentLike = require("../models/commentLike");

const createCommentLike = async (userId, commentId) => {
  try {
    const commentLike = await CommentLike.create({
      userId,
      commentId,
    });
    return commentLike;
  } catch (error) {
    throw error;
  }
};

const deleteCommentLike = async (userId, commentId) => {
  try {
    await CommentLike.findOneAndDelete({ userId, commentId });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCommentLike,
  deleteCommentLike,
};
