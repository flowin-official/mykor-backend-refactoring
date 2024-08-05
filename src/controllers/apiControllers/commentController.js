const {
  newComment,
  commentsInThisPost,
} = require("../../services/commentService");

async function postMyComment(req, res) {
  const userId = req.userId;
  const { postId, content } = req.body;
  try {
    const comment = await newComment(userId, postId, content);
    res.status(201).json({
      message: "Comment created",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsInThisPost(req, res) {
  const postId = req.params.id;
  try {
    const comments = await commentsInThisPost(postId);
    res.status(200).json({
      message: "Comments found",
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postMyComment,
  getCommentsInThisPost,
};
