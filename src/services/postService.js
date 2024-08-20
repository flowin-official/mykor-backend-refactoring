const {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
  updatePost,
  deletePost,
  findPostsInRangeByLocationTag,
  increasePostView,
  findPostsWithKeywordByLocation,
} = require("../repositories/postRepository");
const { findLocationById } = require("../repositories/locationRepository");
const { findTagById } = require("../repositories/tagRepository");

async function postsInRangeByLocationTag(locationId, tag, lastPostId, size) {
  try {
    // 지원하는 지역인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    const posts = await findPostsInRangeByLocationTag(
      location,
      tag,
      lastPostId,
      size
    );
    return posts;
  } catch (error) {
    throw error;
  }
}

async function newPost(title, content, userId, locationId, tagId) {
  try {
    // 해당 지역이 존재하는지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }
    // 해당 태그가 존재하는지 확인
    const tag = await findTagById(tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }

    // 해당 지역 게시판에 글 작성
    const post = await createPost(title, content, userId, location, tag);
    return post;
  } catch (error) {
    throw error;
  }
}

// 게시물 조회
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

async function searchingPosts(locationId, keyword) {
  try {
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    const posts = await findPostsWithKeywordByLocation(location, keyword);
    return posts;
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

async function modifyMyPost(postId, title, content, userId, tagId) {
  try {
    let post = await findPostById(postId);
    // 작성자와 수정요청자가 같은지 확인
    if (post.author.toString() !== userId) {
      throw new Error("Not authorized");
    }
    // 해당 태그가 존재하는지 확인
    const tag = await findTagById(tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }

    post = await updatePost(postId, title, content, tag);
    return post;
  } catch (error) {
    throw error;
  }
}

async function removeMyPost(postId) {
  try {
    await deletePost(postId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  allPosts,
  thisPost,
  newPost,
  myPosts,
  modifyMyPost,
  removeMyPost,
  postsInRangeByLocationTag,
  searchingPosts,
};
