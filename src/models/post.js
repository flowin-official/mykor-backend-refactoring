const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contents: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
  },
  images: [
    {
      key: { type: String },
      url: { type: String },
    },
  ],

  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  commentsList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
