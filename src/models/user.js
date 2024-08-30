const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoUserCode: { type: String, default: null, required: false, unique: true },
  appleUserCode: { type: String, default: null, required: false, unique: true },

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

// Custom validation: kakaoUserCode 또는 AppleUserCode 둘 중 하나는 있어야 하도록 검증 추가
userSchema.path('kakaoUserCode').validate(function (value) {
  return value != null || this.appleUserCode != null;
}, 'Either "kakaoUserCode" or "appleUserCode" must be provided.');

userSchema.path('appleUserCode').validate(function (value) {
  return value != null || this.kakaoUserCode != null;
}, 'Either "kakaoUserCode" or "appleUserCode" must be provided.');


const User = mongoose.model("User", userSchema);
module.exports = User;
