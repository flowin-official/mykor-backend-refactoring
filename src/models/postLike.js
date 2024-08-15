const mongoose = require("mongoose");

const postLikeSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
});

postLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeSchema);
module.exports = PostLike;
