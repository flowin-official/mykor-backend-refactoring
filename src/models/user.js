const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  kakaoUserCode: { 
    type: String, 
    default: null, 
    required: false, 
    unique: false,
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return value != null || this.appleUserCode != null;
        }, 
        message: 'Either "kakaoUserCode" or "appleUserCode" must be provided.',
      },
      {
        //null값만 중복을 허용하기 위한 validator
        validator: async function (value) {
          if (value === null || value === undefined) return true;
          const count = await mongoose.models.User.countDocuments({ kakaoUserCode: value });
          return count === 0;
        },
        message: 'Kakao User Code must be unique or null.',
      }
    ],
  },

  appleUserCode: { 
    type: String, 
    default: null, 
    required: false, 
    unique: false,
    validate: [
      {
        // kakaoUserCode 또는 appleUserCode 둘 중 하나는 required로 하기 위한 validator
        validator: function (value) {
          return value != null || this.kakaoUserCode != null;
        }, 
        message: 'Either "kakaoUserCode" or "appleUserCode" must be provided.',
      },
      {
        //null값만 중복을 허용하기 위한 validator
        validator: async function (value) {
          if (value === null || value === undefined) return true;
          const count = await mongoose.models.User.countDocuments({ appleUserCode: value });
          return count === 0;
        },
        message: 'Apple User Code must be unique or null.',
      }
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
