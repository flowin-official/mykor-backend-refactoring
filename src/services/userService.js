const {
  findUserById,
  updateUser,
  withdrawUser,
  addBlockUser,
} = require("../repositories/userRepository");
const { findLocationById } = require("../repositories/locationRepository");

async function myInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function modifyMyInfo(userId, nickname, locationId) {
  try {
    let user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // 지원 중인 location인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    user = await updateUser(user, nickname, location);
    return user;
  } catch (error) {
    throw error;
  }
}

// 카카오, 애플 로그인 사용자 정보 삭제 추가해야함.
async function removeMyInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await withdrawUser(userId);
  } catch (error) {
    throw error;
  }
}

async function userInfo(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function newBlockUser(userId, blockUserId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const blockUser = await findUserById(blockUserId);
    if (!blockUser) {
      throw new Error("Block user not found");
    }

    await addBlockUser(user, blockUser);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
  userInfo,
  newBlockUser,
};
