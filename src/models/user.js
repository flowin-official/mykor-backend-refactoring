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

  profileImage: {
    type: {
      key: { type: String },
      url: { type: String, default: null },
    },
    default: null,
    validate: {
      validator: function (value) {
        // value가 null이거나, 순서쌍에 key와 url 둘 다 포함된 경우만 유효
        return (
          value === null ||
          (typeof value.key === "string" && typeof value.url === "string")
        );
      },
      message:
        'profileImage must be null or an object containing "key" and "url".',
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
