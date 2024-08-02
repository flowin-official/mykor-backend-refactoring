const {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
} = require("../repositories/postRepository");

async function newPost(title, content, author) {
  try {
    const post = await createPost(title, content, author);
    return post;
  } catch (error) {
    throw error;
  }
}

async function thisPost(postId) {
  try {
    const post = await findPostById(postId);
    if (!post) throw new Error("Post not found");
    return post;
  } catch (error) {
    throw error;
  }
}

async function allPosts() {
  try {
    const posts = await findAllPosts();
    return posts;
  } catch (error) {
    throw error;
  }
}

async function myPosts(userId) {
  try {
    const posts = await findPostsByAuthor(userId);
    return posts;
  } catch (error) {
    throw error;
  }
}

module.exports = { allPosts, thisPost, newPost, myPosts };
