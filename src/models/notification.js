const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // 누가 행위를 했는지
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // 누가 받는지
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }, // 어떤 게시글에 대한 알림인지
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }, // 어떤 댓글에 대한 알림인지
  category: {
    type: String,
    required: true,
  }, // 좋아요, 댓글, 대댓글 등 알림 유형
  read: {
    type: Boolean,
    default: false,
  }, // 읽었는지 여부
  created: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
