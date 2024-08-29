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
// null값은 1:1 unique 설정을 안해야해서 뺌

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
