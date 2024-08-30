const Post = require("../models/post");

const findPostsInRangeByLocationTag = async (
  location,
  tag,
  lastPostId,
  size,
  hot
) => {
  try {
    const query = {
      location,
    };

    // 태그가 있으면 태그 조건 추가
    if (tag) {
      query.tag = tag;
    }

    // lastPostId가 있을 때만 _id 조건 추가
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    if (hot) {
      // 인기순 정렬일 경우 likes 필드로 정렬
      const posts = await Post.find(query)
        .sort({ likes: -1 }) // 인기순 정렬
        .limit(size)
        .populate("author"); // author 필드를 populate하여 User 정보 가져옴; // size만큼 가져옴
      return posts;
    } else {
      // 최신순 정렬일 경우 created 필드로 정렬
      const posts = await Post.find(query)
        .sort({ _id: -1 }) // 최신순 정렬(created로 해도 됨)
        .limit(size)
        .populate("author"); // author 필드를 populate하여 User 정보 가져옴; // size만큼 가져옴
      return posts; // author 필드를 populate하여 User 정보 가져옴
    }
  } catch (error) {
    throw error;
  }
};

const createPost = async (title, content, author, location, tag) => {
  try {
    const post = await Post.create({
      title,
      content,
      author,
      location,
      tag,
    });
    return post;
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

const findPostsByUserId = async (userId) => {
  try {
    const posts = await Post.find({ author: userId });
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
  size
) => {
  try {
    // 검색어를 공백으로 나누어 배열로 만들고, 빈 문자열을 제거
    const keywords = keyword.split(" ").filter((word) => word.trim() !== "");

    const query = {
      location,
    };

    // lastPostId가 있을 때만 _id 조건 추가
    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    // 검색 조건 추가(이미 Service에서 검색어 유무 검증 함)
    query.$and = keywords.map((word) => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        { content: { $regex: word, $options: "i" } },
      ],
    }));

    const posts = await Post.find(query).sort({ _id: -1 }).limit(size);
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
