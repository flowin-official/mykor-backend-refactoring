const CommentLike = require("../models/commentLike");

const createCommentLike = async (userId, commentId) => {
  try {
    const commentLike = await CommentLike.create({
      user: userId,
      comment: commentId,
    });
    return commentLike;
  } catch (error) {
    throw error;
  }
};

const deleteCommentLike = async (userId, commentId) => {
  try {
    await CommentLike.findOneAndDelete({ user: userId, comment: commentId });
  } catch (error) {
    throw error;
  }
};

const findCommentLike = async (userId, commentId) => {
  try {
    const commentLike = await CommentLike.findOne({
      user: userId,
      comment: commentId,
    });
    return commentLike;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCommentLike,
  deleteCommentLike,
  findCommentLike,
};
