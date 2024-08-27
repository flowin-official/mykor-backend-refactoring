const {
  createPost,
  findPostById,
  findPostsByUserId,
  updatePost,
  deletePost,
  findPostsInRangeByLocationTag,
  increasePostView,
  findPostsWithKeywordByLocation,
} = require("../repositories/postRepository");
const { findLocationById } = require("../repositories/locationRepository");
const { findTagById } = require("../repositories/tagRepository");
const { findUserById } = require("../repositories/userRepository");

async function postsInRangeByLocationTag(locationId, tagId, lastPostId, size) {
  try {
    // 지원하는 지역인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("Location not found");
    }

    const posts = await findPostsInRangeByLocationTag(
      location,
      tagId,
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
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시물이 없습니다.");
    }

    await increasePostView(postId); // 게시글 조회수 1 증가
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
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const posts = await findPostsByUserId(user);
    return posts;
  } catch (error) {
    throw error;
  }
}

async function modifyMyPost(postId, title, content, userId, tagId) {
  try {
    let post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const tag = await findTagById(tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }

    // 작성자와 수정요청자가 같은지 확인
    if (post.author.toString() !== user._id.toString()) {
      throw new Error("글 작성자가 아닙니다.");
    } else {
      post = await updatePost(post, title, content, tag);
      return post;
    }
  } catch (error) {
    throw error;
  }
}

async function removeMyPost(userId, postId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // 작성자와 삭제요청자가 같은지 확인
    if (post.author.toString() !== user._id.toString()) {
      throw new Error("글 작성자가 아닙니다.");
    } else {
      await deletePost(post);
    }
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
