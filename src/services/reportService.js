const {
  createPostReport,
  createCommentReport,
  findReportByUserAndComment,
  findReportByUserAndPost,
} = require("../repositories/reportRepository");
const { findUserById } = require("../repositories/userRepository");
const { findCommentById } = require("../repositories/commentRepository");
const { findPostById } = require("../repositories/postRepository");

async function reportComment(commentId, userId, reason, content) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const existingReport = await findReportByUserAndComment(userId, commentId);
    if (existingReport) {
      throw new Error("이미 접수된 댓글 신고입니다.");
    }

    const report = await createCommentReport(comment, user, reason, content);
    return report;
  } catch (error) {
    throw error;
  }
}

async function reportPost(postId, userId, reason, content) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingReport = await findReportByUserAndPost(userId, postId);
    if (existingReport) {
      throw new Error("이미 접수된 게시글 신고입니다.");
    }

    const report = await createPostReport(post, user, reason, content);
    return report;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  reportComment,
  reportPost,
};
