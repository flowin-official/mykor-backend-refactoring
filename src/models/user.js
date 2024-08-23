const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoUserCode: { type: String, required: true, unique: true },

  nickname: {
    type: String,
    default: "user" + `${Math.floor(Math.random() * 99999999)}`,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    default: null,
  },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
