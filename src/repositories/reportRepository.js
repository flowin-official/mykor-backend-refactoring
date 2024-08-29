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

const findReportByUserAndPost = async (userId, postId) => {
  try {
    const report = await Report.findOne({ user: userId, post: postId });
    return report;
  } catch (error) {
    throw error;
  }
};

const findReportByUserAndComment = async (userId, commentId) => {
  try {
    const report = await Report.findOne({ user: userId, comment: commentId });
    return report;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCommentReport,
  createPostReport,
  findReportByUserAndPost,
  findReportByUserAndComment,
};
