const {
  createNotification,
  findNoticiationByUserId,
  modifyNotificationToReadById,
  findNotificationById,
} = require("../repositories/notificationRepository");
const { findUserById } = require("../repositories/userRepository");

async function notificationsByUser(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notifications = await findNoticiationByUserId(userId);
    return notifications;
  } catch (error) {
    throw error;
  }
}

async function readNotification(userId, notificationId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notification = await findNotificationById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    await modifyNotificationToReadById(notification);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  notificationsByUser,
  readNotification,
};
