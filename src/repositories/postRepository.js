const Post = require("../models/post");

const createPost = async (title, content, author) => {
  try {
    const post = await Post.create({
      title,
      content,
      author,
    });
    return post;
  } catch (error) {
    throw error;
  }
};

const findAllPosts = async () => {
  try {
    const posts = await Post.find();
    return posts;
  } catch (error) {
    throw error;
  }
};

const findPostById = async (postId) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    throw error;
  }
};

const findPostsByAuthor = async (authorId) => {
  try {
    const posts = await Post.find({ author: authorId });
    return posts;
  } catch (error) {
    throw error;
  }
};

const findPostsByLocation = async (location) => {
  try {
    const posts = await Post.find({ location });
    return posts;
  } catch (error) {
    throw error;
  }
};

const findPostsByLocationTag = async (location, tag) => {
  try {
    const posts = await Post.find({ location, tag });
    return posts;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (postId, title, content, tag) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content, tag },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    await Post.findByIdAndDelete(postId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
  updatePost,
  deletePost,
};
