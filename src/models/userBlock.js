const mongoose = require("mongoose");

const userBlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blockedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
});

userBlockSchema.index({ comment: 1, user: 1 }, { unique: true });

const UserBlock = mongoose.model("UserBlock", userBlockSchema);
module.exports = UserBlock;
