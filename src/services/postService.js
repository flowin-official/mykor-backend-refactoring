const {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
} = require("../repositories/postRepository");
const { findUserById } = require("../repositories/userRepository");
const {
  findLocationByCountryDetails,
} = require("../repositories/locationRepository");

async function newPost(title, content, userId, country, details, tag) {
  try {
    // 지원하는 지역정보 확인
    const location = await findLocationByCountryDetails(country, details);
    if (!location) throw new Error("Location not found");

    // 해당 지역 게시판에 글 작성
    const post = await createPost(title, content, userId, location, tag);
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

async function locationPosts(location) {
  try {
    const posts = await findPostsByLocation(location);
    return posts;
  } catch (error) {
    throw error;
  }
}

async function locationTagPosts(location, tag) {
  try {
    const posts = await findPostsByLocationTag(location, tag);
    return posts;
  } catch (error) {
    throw error;
  }
}

async function modifyMyPost(postId, title, content) {
  try {
    const post = await updatePost(postId, title, content);
    return post;
  } catch (error) {
    throw error;
  }
}

async function removeMyPost(postId) {
  try {
    const post = await deletePost(postId);
    return post;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  allPosts,
  thisPost,
  newPost,
  myPosts,
  locationPosts,
  locationTagPosts,
  modifyMyPost,
  removeMyPost,
};
