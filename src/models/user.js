const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoUserCode: {
    type: String,
    default: null,
    required: false,
    // null은 unique 검사 대상에서 제외하기 위한 partialFilterExpression
    partialFilterExpression: { kakaoUserCode: { $ne: null } },
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return (
            value != null ||
            this.appleUserCode != null ||
            this.googleUserCode != null
          );
        },
        message:
          'Either "kakaoUserCode" or "appleUserCode" or "googleUserCode" must be provided.',
      },
    ],
  },

  appleUserCode: {
    type: String,
    default: null,
    required: false,
    // null은 unique 검사 대상에서 제외하기 위한 partialFilterExpression
    partialFilterExpression: { appleUserCode: { $ne: null } },
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return (
            value != null ||
            this.kakaoUserCode != null ||
            this.googleUserCode != null
          );
        },
        message:
          'Either "kakaoUserCode" or "appleUserCode" or "googleUserCode" must be provided.',
      },
    ],
  },

  googleUserCode: {
    type: String,
    default: null,
    required: false,
    // null은 unique 검사 대상에서 제외하기 위한 partialFilterExpression
    partialFilterExpression: { googleUserCode: { $ne: null } },
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return (
            value != null ||
            this.kakaoUserCode != null ||
            this.appleUserCode != null
          );
        },
        message:
          'Either "kakaoUserCode" or "appleUserCode" or "googleUserCode" must be provided.',
      },
    ],
  },

  nickname: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    default: null,
  },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  deleted: { type: Date, default: null },

  blockedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },

  fcmToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
