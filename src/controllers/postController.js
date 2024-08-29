const {
  thisPost,
  newPost,
  myPosts,
  modifyMyPost,
  removeMyPost,
  postsInRangeByLocationTag,
  searchingPosts,
} = require("../services/postService");
const {
  isLikedPost,
  isLikedComment,
  likePost,
  dislikePost,
} = require("../services/likeService");
const { reportPost } = require("../services/reportService");
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
 *     summary: 범위 내 게시글 가져오기
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *         description: 게시글을 가져올 국가코드
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: 게시글의 태그
 *       - in: query
 *         name: lastPostId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 게시글 ID
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 게시글 수
 *       - in: query
 *         name: hot
 *         schema:
 *           type: bool
 *         description: 인기순 정렬 여부
 *     responses:
 *       200:
 *         description: 범위 내 게시글 조회 성공
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
async function getPostsInRange(req, res) {
  const locationId = req.query.locationId;
  const tagId = req.query.tagId;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  const hot = req.query.hot;
  try {
    const posts = await postsInRangeByLocationTag(
      locationId,
      tagId,
      lastPostId,
      size,
      hot
    );
    res.status(200).json({
      message: "Get posts in range",
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
 *     summary: 게시글 조회(로그인/비로그인 구분)
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: false
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 특정 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *                   properties:
 *                     comments_list:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 */
async function getThisPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;

  try {
    const post = await thisPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await commentsOnThisPost(postId);

    let postLike = false;
    let commentsLikes = {};

    if (req.isAuthenticated) {
      postLike = await isLikedPost(postId, userId); // 로그인한 사용자일 때만 좋아요 여부 확인

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
        commentsList: comments.map((comment) => ({
          ...comment.toObject(),
          commentLike: commentsLikes[comment._id] || false,
        })),
      },
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
 *         name: locationId
 *         schema:
 *           type: string
 *         description: 게시글을 검색할 국가
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색할 키워드
 *       - in: query
 *         name: lastPostId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 게시글 ID
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: 한 페이지에 가져올 게시글 수
 *     responses:
 *       200:
 *         description: 게시글 검색 성공
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
async function getPostsSearch(req, res) {
  const locationId = req.query.locationId;
  const keyword = req.query.keyword;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const posts = await searchingPosts(locationId, keyword, lastPostId, size);
    res.status(200).json({
      message: "Searched posts",
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
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *               locationId:
 *                 type: string
 *               tagId:
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
  const { title, content, locationId, tagId } = req.body;
  try {
    const post = await newPost(title, content, userId, locationId, tagId);
    res.status(201).json({
      message: "Post created",
      post: {
        ...post.toObject(),
        location: post.location._id,
        tag: post.tag._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /posts/user:
 *   get:
 *     summary: 내가 쓴 게시글 가져오기
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *   put:
 *     summary: 게시글 수정
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *               tagId:
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
  const { title, content, tagId } = req.body;
  try {
    const post = await modifyMyPost(postId, title, content, userId, tagId);
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
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
    await removeMyPost(userId, postId);
    res.status(200).json({
      message: "Post deleted",
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
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
    const postLike = await likePost(postId, userId);
    res.status(200).json({
      message: "Post liked",
      postLike: {
        ...postLike.toObject(),
        post: postLike.post._id,
        user: postLike.user._id,
      },
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
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *       500:
 *         description: 서버 에러
 */
async function deleteLikePost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  try {
    await dislikePost(postId, userId);
    res.status(200).json({
      message: "Post unliked",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /post/{postId}/report:
 *   post:
 *     summary: 게시글 신고
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *               reason:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 신고완료
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
async function postReportPost(req, res) {
  const userId = req.userId;
  const postId = req.params.postId;
  const { reason, content } = req.body;
  try {
    const post = await reportPost(postId, userId, reason, content);
    res.status(201).json({
      message: "Post reported",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyPosts,
  postMyPost,
  getThisPost,
  putMyPost,
  deleteMyPost,
  postLikePost,
  deleteLikePost,
  getPostsInRange,
  getPostsSearch,
  postReportPost,
};
