const {
  createPost,

  findPostById,
  findPostsByUserId,

  updatePost,
  deletePost,

  increasePostView,

  findPostsInRangeByLocationTag,
  findPostsWithKeywordByLocation,
} = require("../repositories/postRepository");
const { findLocationById } = require("../repositories/locationRepository");
const { findTagById } = require("../repositories/tagRepository");
const { findUserById } = require("../repositories/userRepository");

async function postsInRangeByLocationTagWithBlock(
  locationId,
  tagId,
  lastPostId,
  size,
  hot,
  userId
) {
  try {
    // 지원하는 지역인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("지원하지 않는 지역입니다.");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const posts = await findPostsInRangeByLocationTagWithBlock(
      location,
      tagId,
      lastPostId,
      size,
      hot,
      user.blockedUsers // 사용자가 차단한 사용자 목록 전달
    );
    return posts;
  } catch (error) {
    throw error;
  }
}

async function postsInRangeByLocationTag(
  locationId,
  tagId,
  lastPostId,
  size,
  hot
) {
  try {
    // 지원하는 지역인지 확인
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("지원하지 않는 지역입니다.");
    }

    const posts = await findPostsInRangeByLocationTag(
      location,
      tagId,
      lastPostId,
      size,
      hot,
      [] // 비회원은 블록된 사용자가 없으므로 빈 배열 전달
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
    // 해당 유저가 존재하는지 확인
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 해당 지역 게시판에 글 작성
    const post = await createPost(title, content, user, location, tag);
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

async function searchingPosts(locationId, keyword, lastPostId, size) {
  try {
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("지원하지 않는 지역입니다.");
    }

    const posts = await findPostsWithKeywordByLocation(
      location,
      keyword,
      lastPostId,
      size,
      [] // 비회원은 블록된 사용자가 없으므로 빈 배열
    );
    return posts;
  } catch (error) {
    throw error;
  }
}

async function searchingPostsWithBlock(
  locationId,
  keyword,
  lastPostId,
  size,
  userId
) {
  try {
    const location = await findLocationById(locationId);
    if (!location) {
      throw new Error("지원하지 않는 지역입니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const posts = await findPostsWithKeywordByLocation(
      location,
      keyword,
      lastPostId,
      size,
      user.blockedUsers // 사용자가 차단한 사용자 목록 전달
    );
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
    if (post.author._id.toString() !== user._id.toString()) {
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
    if (post.author._id.toString() !== user._id.toString()) {
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
  postsInRangeByLocationTagWithBlock,

  searchingPosts,
  searchingPostsWithBlock,
};
