const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  kakaoUserCode: { type: String, required: true, unique: true },

  userName: {
    type: String,
    default: "user" + `${Math.floor(Math.random() * 99999999)}`,
  },
  userLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    default: null,
  },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
