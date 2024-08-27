const Report = require("../models/report");

const createCommentReport = async (commentId, userId, reason, content) => {
  try {
    const report = await Report.create({
      comment: commentId,
      user: userId,
      reason,
      content,
    });
    return report;
  } catch (error) {
    throw error;
  }
};

const createPostReport = async (postId, userId, reason, content) => {
  try {
    const report = await Report.create({
      post: postId,
      user: userId,
      reason,
      content,
    });
    return report;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCommentReport,
  createPostReport,
};
