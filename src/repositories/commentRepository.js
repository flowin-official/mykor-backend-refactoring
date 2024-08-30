const Comment = require("../models/comment");

const createComment = async (userId, postId, content) => {
  try {
    const comment = await Comment.create({
      author: userId,
      post: postId,
      content,
    });
    return comment;
  } catch (error) {
    throw error;
  }
};

const findCommentsByPostId = async (postId) => {
  try {
    const comments = await Comment.find({ post: postId }).populate("author");
    return comments;
  } catch (error) {
    throw error;
  }
};

const findCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId).populate("author");
    return comment;
  } catch (error) {
    throw error;
  }
};

const updateComment = async (commentId, content) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content, updatedAt: Date.now() },
      { new: true }
    );
    return comment;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    throw error;
  }
};

const increaseCommentLike = async (commentId) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return comment;
  } catch (error) {
    throw error;
  }
};

const decreaseCommentLike = async (commentId) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: -1 } },
      { new: true }
    );
    return comment;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createComment,
  findCommentsByPostId,
  findCommentById,
  updateComment,
  deleteComment,
  increaseCommentLike,
  decreaseCommentLike,
};
