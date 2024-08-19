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
  searchingPosts,
} = require("../services/postService");
const { isLikedPost, isLikedComment } = require("../services/likeService");
const { commentsOnThisPost } = require("../services/commentService");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 관련 API
 */

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
 * /post/{postId}:
 *   get:
 *     summary: 특정 게시글 가져오기
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
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
        ...post.toObject(),
        postLike,
      },
      comments: comments.map((comment) => ({
        ...comment.toObject(),
        commentLike: commentsLikes[comment._id] || false,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: 게시글 검색
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 검색된 게시글 조회 성공
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
async function getSearchPosts(req, res) {
  const { country, tag, keyword } = req.query;
  try {
    const posts = await searchingPosts(country, tag, keyword);
    res.status(200).json({
      message: "Search results",
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
 *     summary: 특정 게시글 수정
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
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
async function updateThisPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  const { title, content, tag } = req.body;

  try {
    const post = await modifyMyPost(postId, userId, title, content, tag);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

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
 *     summary: 특정 게시글 삭제
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
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
async function deleteThisPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  try {
    const post = await removeMyPost(postId, userId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /post/like/{postId}:
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
 *         description: 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
async function postLike(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  try {
    const { likeCount } = await likePost(postId, userId);
    res.status(200).json({
      message: "Post liked",
      likeCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /post/dislike/{postId}:
 *   post:
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
 *         description: 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
async function postDislike(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  try {
    const { likeCount } = await dislikePost(postId, userId);
    res.status(200).json({
      message: "Post disliked",
      likeCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllPosts,
  getThisPost,
  postMyPost,
  getMyPosts,
  getSearchPosts,
  updateThisPost,
  deleteThisPost,
  postLike,
  postDislike,
};
