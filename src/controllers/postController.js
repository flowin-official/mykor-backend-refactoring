const {
  allPosts,
  thisPost,
  newPost,
  myPosts,
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
  const { title, content } = req.body;
  try {
    const post = await newPost(title, content, userId);
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

module.exports = {
  getMyPosts,
  postMyPost,
  getAllPosts,
  getThisPost,
};
