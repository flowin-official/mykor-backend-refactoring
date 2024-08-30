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

const findNoticiationByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({
      user: userId,
    }).populate("user");
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
  } catch (error) {
    throw error;
  }
};

const findNotificationById = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    return notification;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  findNoticiationByUserId,
  modifyNotificationToReadById,
  findNotificationById,
};
