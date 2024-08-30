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

    await modifyNotificationsToReadByUserId(userId); // 전부 읽음 처리
    const notifications = await findNotificationsByUserId(userId);
    return notifications;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myNotifications,
};
