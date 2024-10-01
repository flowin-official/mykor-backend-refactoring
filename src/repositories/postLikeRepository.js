const PostLike = require("../models/postLike");

const createPostLike = async (postId, userId) => {
  try {
    const postLike = await PostLike.create({
      post: postId,
      user: userId,
    });
    return postLike;
  } catch (error) {
    throw error;
  }
};

const deletePostLike = async (postId, userId) => {
  try {
    await PostLike.findOneAndDelete({ post: postId, user: userId });
  } catch (error) {
    throw error;
  }
};

const findPostLike = async (postId, userId) => {
  try {
    const postLike = await PostLike.findOne({
      post: postId,
      user: userId,
    });
    return postLike;
  } catch (error) {
    throw error;
  }
};

const findPostLikesByUserId = async (userId) => {
  try {
    const postLikes = await PostLike.find({ user: userId });
    return postLikes;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPostLike,
  deletePostLike,
  findPostLike,
  findPostLikesByUserId,
};
