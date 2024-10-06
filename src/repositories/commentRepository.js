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

const findCommentsByPostId = async (postId, blockedUsers) => {
  try {
    const comments = await Comment.find({
      post: postId,
      author: { $nin: blockedUsers },
    }).populate("author");
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

const findCommentsByUserId = async (userId, lastCommentId, size) => {
  try {
    const query = {
      author: userId,
    };

    if (lastCommentId) {
      query._id = { $lt: lastCommentId };
    }

    const comments = await Comment.find(query)
      .sort({ _id: -1 })
      .limit(size)
      .populate({
        path: "post",
        populate: {
          path: "author", // post 객체 안의 author도 populate
        },
      })
      .populate("author");
    return comments;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createComment,

  findCommentsByPostId,
  findCommentById,
  findCommentsByUserId,

  updateComment,
  deleteComment,

  increaseCommentLike,
  decreaseCommentLike,
};
