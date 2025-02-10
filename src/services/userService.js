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

async function modifyMyInfo(userId, nickname, locationId, profileImage) {
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

    user = await updateUser(user, nickname, location, profileImage);
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

async function usersInfo(userIds) {
  try {
    const users = [];
    for (const userId of userIds) {
      const user = await findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      users.push(user);
    }

    return users;
  } catch (error) {
    throw error;
  }
}

async function newBlockUser(userId, blockedUserId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const blockedUser = await findUserById(blockedUserId);
    if (!blockedUser) {
      throw new Error("Block user not found");
    }

    await addBlockUser(user, blockedUser);
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
  usersInfo,
};
