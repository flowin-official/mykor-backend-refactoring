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
  dislikePost,
  postsInRangeByLocationTag,
} = require("../services/postService");
const { isLikedPost, isLikedComment } = require("../services/likeService");
const { commentsOnThisPost } = require("../services/commentService");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 관련 API
 */

async function getPostsInRange(req, res) {
  const country = req.query.country;
  const tag = req.query.tag;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const posts = await postsInRangeByLocationTag(
      country,
      tag,
      lastPostId,
      size
    );
    res.status(200).json({
      message: "Get posts in range",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getThisPost(req, res) {
  const userId = req.userId; // 비회원이면 null
  const postId = req.params.postId;

  try {
    const post = await thisPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await commentsOnThisPost(postId);

    let postLike = false;
    let commentsLikes = {};

    if (userId) {
      // 로그인한 사용자일 때만 좋아요 여부 확인
      postLike = await isLikedPost(postId, userId);

      // 댓글 좋아요 여부 확인
      for (let comment of comments) {
        commentsLikes[comment._id] = await isLikedComment(comment._id, userId);
      }
    }

    res.status(200).json({
      message: "This post",
      post: {
        ...post,
        postLike,
      },
      comments: comments.map((comment) => ({
        ...comment,
        commentLike: commentsLikes[comment._id],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 모든 게시글 가져오기
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 모든 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
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

/**
 * @swagger
 * /post:
 *   post:
 *     summary: 게시글 작성
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               country:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function postMyPost(req, res) {
  const userId = req.userId;
  const { title, content, country, tag } = req.body;
  try {
    const post = await newPost(title, content, userId, country, tag);
    res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user/posts:
 *   get:
 *     summary: 내가 쓴 게시글 가져오기
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 내가 쓴 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
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

/**
 * @swagger
 * /posts/{location}:
 *   get:
 *     summary: 지역별 게시글 가져오기
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 지역별 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
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

/**
 * @swagger
 * /posts/{location}/{tag}:
 *   get:
 *     summary: 지역별 태그된 게시물 가져오기
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 지역별 태그된 게시물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: 서버 에러
 */
async function getLocationTagPosts(req, res) {
  const location = req.params.location;
  const tag = req.params.tag;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const posts = await locationTagPosts(location, tag, lastPostId, size);
    res.status(200).json({
      message: "Location tag posts found",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /post/{postId}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function putMyPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
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

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function deleteMyPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
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

/**
 * @swagger
 * /post/{postId}/like:
 *   post:
 *     summary: 게시글 좋아요
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function postLikePost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
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

/**
 * @swagger
 * /post/{postId}/like:
 *   delete:
 *     summary: 게시글 좋아요 취소
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       500:
 *         description: 서버 에러
 */
async function deleteLikePost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  try {
    const post = await dislikePost(postId, userId);
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
  getPostsInRange,
};
