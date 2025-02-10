const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // post: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Post",
  //   required: true,
  // },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  nestedCommentsList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },

  // 대댓글 추가
  // parentComment: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Comment",
  //   default: null, // null이면 그냥 댓글, 값이 있으면 대댓글
  // },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
