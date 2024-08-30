const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoUserCode: { 
    type: String, 
    default: null, 
    required: false, 
    unique: true,
    // null은 unique 검사 대상에서 제외하기 위한 partialFilterExpression
    partialFilterExpression: { kakaoUserCode: { $ne: null } },
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return value != null || this.appleUserCode != null;
        }, 
        message: 'Either "kakaoUserCode" or "appleUserCode" must be provided.',
      },
    ],
  },

  appleUserCode: { 
    type: String, 
    default: null, 
    required: false, 
    unique: true,
    // null은 unique 검사 대상에서 제외하기 위한 partialFilterExpression
    partialFilterExpression: { kakaoUserCode: { $ne: null } },
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return value != null || this.kakaoUserCode != null;
        }, 
        message: 'Either "kakaoUserCode" or "appleUserCode" must be provided.',
      },
    ],
  },

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
