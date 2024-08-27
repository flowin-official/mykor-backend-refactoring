const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  content: { type: String, default: null },

  created: { type: Date, default: Date.now },
});

// 한 계정당 한번씩만 신고 가능
reportSchema.index({ post: 1, user: 1 }, { unique: true });
reportSchema.index({ comment: 1, user: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
