const Notification = require("../models/notification");

const createNotification = async (fromUser, user, post, comment, category) => {
  try {
    const notification = await Notification.create({
      fromUser,
      user,
      post,
      comment,
      category,
    });
    return notification;
  } catch (error) {
    throw error;
  }
};

const findNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({
      user: userId,
    }).populate("fromUser");
    return notifications;
  } catch (error) {
    throw error;
  }
};

const modifyNotificationsToReadByUserId = async (userId) => {
  try {
    await Notification.updateMany({ user: userId }, { read: true });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  findNotificationsByUserId,
  modifyNotificationsToReadByUserId,
};
