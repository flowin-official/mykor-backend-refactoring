const {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
  findPostsByLocation,
  findPostsByLocationTag,
  updatePost,
  deletePost,
  increasePostView,
  increasePostLike,
  decreasePostLike,
} = require("../repositories/postRepository");
const {
  createPostLike,
  deletePostLike,
} = require("../repositories/postLikeRepository");

async function newPost(title, content, userId, location, tag) {
  try {
    // 해당 지역 게시판에 글 작성
    const post = await createPost(title, content, userId, location, tag);
    return post;
  } catch (error) {
    throw error;
  }
}

async function thisPost(postId) {
  try {
    // 게시글 조회수 1 증가
    await increasePostView(postId);

    const post = await findPostById(postId);
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

async function modifyMyPost(postId, title, content, tag) {
  try {
    const post = await updatePost(postId, title, content, tag);
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

async function likePost(postId, userId) {
  try {
    await increasePostLike(postId);
    const post = await createPostLike(postId, userId);
    return post;
  } catch (error) {
    throw error;
  }
}

async function unlikePost(postId, userId) {
  try {
    await decreasePostLike(postId);
    const post = await deletePostLike(postId, userId);
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
  likePost,
  unlikePost,
};
