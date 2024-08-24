const User = require("../models/user");

// const createUser = async (email, password, name) => {
//   try {
//     const user = await User.create({
//       email,
//       password,
//       name,
//     });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

const createKakaoUser = async (kakaoUserCode) => {
  try {
    const user = await User.create({
      kakaoUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createAppleUser = async (appleUserCode) => {
  try {
    const user = await User.create({
      appleUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
}

// const findUserByEmail = async (email) => {
//   try {
//     const user = await User.findOne({
//       email,
//     });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserByKakaoUserCode = async (kakaoUserCode) => {
  try {
    const user = await User.findOne({
      kakaoUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const findUserByAppleUserCode = async (appleUserCode) => {
  try {
    const user = await User.findOne({
      appleUserCode,
    });
    return user;
  } catch (error) {
    throw error;
  }
}

const updateUser = async (userId, userName, userEmail, userLocation) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        userEmail,
        userLocation,
      },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  // createUser,
  createKakaoUser,
  createAppleUser,
  findUserByKakaoUserCode,
  findUserByAppleUserCode,
  // findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
};
