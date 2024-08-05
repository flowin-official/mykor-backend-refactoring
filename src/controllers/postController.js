const {
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
} = require("../services/postService");

async function getAllPosts(req, res) {
  try {
    const posts = await allPosts();
    res.status(200).json({
      message: "All posts",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 게시글 조회
async function getThisPost(req, res) {
  const postId = req.params.id;
  try {
    const post = await thisPost(postId);
    res.status(200).json({
      message: "Post found",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postMyPost(req, res) {
  const userId = req.userId;
  const { title, content, location, tag } = req.body;
  try {
    const post = await newPost(title, content, userId, location, tag);
    res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMyPosts(req, res) {
  const userId = req.userId;
  try {
    const posts = await myPosts(userId);
    res.status(200).json({
      message: "User posts found",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLocationPosts(req, res) {
  const location = req.params.location;
  try {
    const posts = await locationPosts(location);
    res.status(200).json({
      message: "Location posts found",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLocationTagPosts(req, res) {
  const location = req.params.location;
  const tag = req.params.tag;
  try {
    const posts = await locationTagPosts(location, tag);
    res.status(200).json({
      message: "Location tag posts found",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function putMyPost(req, res) {
  const userId = req.userId;
  const postId = req.params.id;
  const { title, content, tag } = req.body;
  try {
    const post = await modifyMyPost(postId, title, content, tag);
    res.status(200).json({
      message: "Post updated",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMyPost(req, res) {
  const userId = req.userId;
  const postId = req.params.id;
  try {
    const post = await removeMyPost(postId);
    res.status(200).json({
      message: "Post deleted",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postLikePost(req, res) {
  const userId = req.userId;
  const postId = req.params.id;
  try {
    const post = await likePost(postId, userId);
    res.status(200).json({
      message: "Post liked",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteLikePost(req, res) {
  const userId = req.userId;
  const postId = req.params.id;
  try {
    const post = await unlikePost(postId, userId);
    res.status(200).json({
      message: "Post unliked",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyPosts,
  postMyPost,
  getAllPosts,
  getThisPost,
  putMyPost,
  deleteMyPost,
  getLocationPosts,
  getLocationTagPosts,
  postLikePost,
  deleteLikePost,
};
