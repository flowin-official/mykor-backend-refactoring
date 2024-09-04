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

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
