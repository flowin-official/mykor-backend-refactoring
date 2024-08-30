const {
  findNotificationsByUserId,
  modifyNotificationsToReadByUserId,
} = require("../repositories/notificationRepository");
const { findUserById } = require("../repositories/userRepository");

async function myNotifications(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notifications = await findNotificationsByUserId(user);
    return notifications;
  } catch (error) {
    throw error;
  }
}

async function readMyNotifications(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await modifyNotificationsToReadByUserId(user); // 전부 읽음 처리
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myNotifications,
  readMyNotifications,
};
