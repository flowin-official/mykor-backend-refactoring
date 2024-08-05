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

const createKakaoUser = async (kakaoUserCode, userName) => {
  try {
    const user = await User.create({
      kakaoUserCode,
      userName,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

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
  findUserByKakaoUserCode,
  // findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
};
