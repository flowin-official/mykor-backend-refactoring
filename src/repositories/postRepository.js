const Post = require("../models/post");

const findPostsInRangeByLocationTag = async (
  location,
  tag,
  lastPostId,
  size,
  hot,
  blockedUsers
) => {
  try {
    // 기본 쿼리 생성
    const query = {
      location,
      author: { $nin: blockedUsers }, // blockedUsers에 포함되지 않은 사용자만 조회
    };

    // 태그가 있으면 태그 조건 추가
    if (tag) {
      query.tag = tag;
    }

    // lastPostId가 있을 때만 _id 조건 추가 (이전 게시물보다 더 최신의 게시물)
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    // 기본 정렬 옵션 설정 (_id로 정렬)
    let sortOption = { _id: -1 };

    // hot이 true일 경우 likes 필드로 추가 정렬
    if (hot) {
      sortOption = { likes: -1, _id: -1 };
    }

    // 쿼리 실행: 정렬, 제한 및 author 필드 populate
    const posts = await Post.find(query)
      .sort(sortOption) // hot에 따라 정렬 옵션 적용
      .limit(size) // size만큼 제한
      .populate("author"); // author 필드를 populate하여 User 정보 가져옴

    return posts;
  } catch (error) {
    throw error;
  }
};

const createPost = async (title, contents, author, location, tag, images) => {
  try {
    const post = await Post.create({
      title,
      contents,
      author,
      location,
      tag,
      images,
    });
    return post;
  } catch (error) {
    throw error;
  }
};

const findPostById = async (postId) => {
  try {
    const post = await Post.findById(postId).populate("author");
    return post;
  } catch (error) {
    throw error;
  }
};

const findPostsByUserId = async (userId, lastPostId, size) => {
  try {
    // 기본 쿼리 생성
    const query = {
      author: userId,
    };

    // lastPostId가 있을 때만 _id 조건 추가
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    // 쿼리 실행: 정렬, 제한 및 author 필드 populate
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(size)
      .populate("author");

    return posts;
  } catch (error) {
    throw error;
  }
};

const findPostsByPostLikes = async (postLikes, lastPostId, size) => {
  try {
    // postLikes 배열에서 post 필드만 추출
    const postIds = postLikes.map((postLike) => postLike.post);

    // 기본 쿼리 생성
    const query = {
      _id: { $in: postIds },
    };

    // lastPostId가 있을 때만 _id 조건 추가
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    // 쿼리 실행: 정렬, 제한 및 author 필드 populate
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(size)
      .populate("author");

    return posts;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (postId, title, content, tag) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content, tag, updatedAt: Date.now() },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

const increasePostView = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
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

const increasePostLike = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

const decreasePostLike = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: -1 } },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

// 게시글 검색
const findPostsWithKeywordByLocation = async (
  location,
  keyword,
  lastPostId,
  size,
  blockedUsers
) => {
  try {
    // 검색어를 공백으로 나누어 배열로 만들고, 빈 문자열을 제거
    const keywords = keyword.split(" ").filter((word) => word.trim() !== "");

    const query = {
      location,
      author: { $nin: blockedUsers }, // blockedUsers에 포함되지 않은 사용자만 조회
    };

    // lastPostId가 있을 때만 _id 조건 추가
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    // 검색 조건 추가
    query.$and = keywords.map((word) => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        { content: { $regex: word, $options: "i" } },
      ],
    }));

    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(size)
      .populate("author");

    return posts;
  } catch (error) {
    throw error;
  }
};

const increasePostComment = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { comments: 1 } },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

const decreasePostComment = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { comments: -1 } },
      { new: true }
    );
    return post;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPost,

  findPostById,
  findPostsByUserId,
  findPostsByPostLikes,

  updatePost,
  deletePost,

  increasePostView,

  increasePostLike,
  decreasePostLike,

  findPostsInRangeByLocationTag,
  findPostsWithKeywordByLocation,

  increasePostComment,
  decreasePostComment,
};
