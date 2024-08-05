const {
  newComment,
  modifyComment,
  removeComment,
  likeComment,
  dislikeComment,
  commentsOnThisPost,
} = require("../services/commentService");

async function postMyComment(req, res) {
  const userId = req.userId;
  const { postId, content } = req.body;
  try {
    const comment = await newComment(userId, postId, content);
    res.status(200).json({
      message: "Comment created",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function putMyComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  try {
    const comment = await modifyComment(commentId, content);
    res.status(200).json({
      message: "Comment updated",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMyComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await removeComment(commentId);
    res.status(200).json({
      message: "Comment deleted",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postLikeComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await likeComment(commentId, userId);
    res.status(200).json({
      message: "Comment liked",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteLikeComment(req, res) {
  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const comment = await dislikeComment(commentId, userId);
    res.status(200).json({
      message: "Comment unliked",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsOnThisPost(req, res) {
  const postId = req.params.postId;
  try {
    const comments = await commentsOnThisPost(postId);
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
  putMyComment,
  deleteMyComment,
  postLikeComment,
  deleteLikeComment,
  getCommentsOnThisPost,
};
