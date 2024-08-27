const mongoose = require("mongoose");

const postLikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
});

postLikeSchema.index({ post: 1, user: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeSchema);
module.exports = PostLike;
