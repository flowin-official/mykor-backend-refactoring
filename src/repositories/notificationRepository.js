const Notification = require("../models/notification");

const createNotification = async (user, post, comment, category) => {
  try {
    const notification = await Notification.create({
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

const findNotReadNoticiationByUser = async (user) => {
  try {
    const notifications = await Notification.find({ user, read: false });
    return notifications;
  } catch (error) {
    throw error;
  }
};

const modifyNotificationToReadById = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    notification.read = true;
    await notification.save();
    return notification;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  findNotReadNoticiationByUser,
  modifyNotificationToReadById,
};
