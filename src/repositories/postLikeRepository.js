const PostLike = require("../models/postLike");

const createPostLike = async (postId, userId) => {
  try {
    const postLike = await PostLike.create({
      post_id: postId,
      user_id: userId,
    });
    return postLike;
  } catch (error) {
    throw error;
  }
};

const deletePostLike = async (postId, userId) => {
  try {
    await PostLike.findOneAndDelete({ post_id: postId, user_id: userId });
  } catch (error) {
    throw error;
  }
};

const findPostLike = async (postId, userId) => {
  try {
    const postLike = await PostLike.findOne({
      post_id: postId,
      user_id: userId,
    });
    return postLike;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPostLike,
  deletePostLike,
  findPostLike,
};
