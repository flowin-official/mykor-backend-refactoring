const mongoose = require("mongoose");

const commentLikeSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
});

commentLikeSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);
module.exports = CommentLike;
