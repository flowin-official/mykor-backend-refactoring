const {
  thisPost,
  newPost,
  myPosts,
  myPostLikes,
  modifyMyPost,
  removeMyPost,
  userPosts,

  postsInRangeByLocationTag,
  postsInRangeByLocationTagWithBlock,

  searchingPosts,
  searchingPostsWithBlock,
} = require("../services/postService");
const {
  isLikedPost,
  isLikedComment,

  likePost,
  dislikePost,
} = require("../services/likeService");
const { reportPost } = require("../services/reportService");
const {
  commentsOnThisPost,
  commentsOnThisPostWithBlock,
} = require("../services/commentService");
const { generateGetPresignedUrl } = require("../services/s3Service");
const { sendLikePush } = require("../services/notificationService");

async function getPostsInRange(req, res) {
  const locationId = req.query.locationId;
  const tagId = req.query.tagId;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  const hot = req.query.hot;
  try {
    if (
      !locationId ||
      !size ||
      hot === undefined ||
      hot === null ||
      (hot !== "true" && hot !== "false")
    ) {
      return res.status(400).json({ message: "잘못된 요청" });
    }

    // hot 값을 boolean으로 변환
    const isHot = hot === "true";

    const posts = await postsInRangeByLocationTag(
      locationId,
      tagId,
      lastPostId,
      size,
      isHot
    );

    res.status(200).json({
      message: "Get posts in range",
      posts: await Promise.all(
        posts.map(async (post) => {
          const previewImageWithUrl =
            post.images.length > 0
              ? [
                  {
                    key: post.images[0],
                    url: await generateGetPresignedUrl(post.images[0]),
                  },
                ]
              : [];

          return {
            ...post.toObject(),
            author: {
              _id: post.author._id,
              nickname: post.author.nickname,
              location: post.author.location,
              deleted: post.author.deleted,
            },
            images: previewImageWithUrl, // 이미지가 없는 경우 빈 배열 반환
          };
        })
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getPostsInRangeWithLogin(req, res) {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.userId;

  const locationId = req.query.locationId;
  const tagId = req.query.tagId;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  const hot = req.query.hot;
  try {
    if (
      !locationId ||
      !size ||
      hot === undefined ||
      hot === null ||
      (hot !== "true" && hot !== "false")
    ) {
      return res.status(400).json({ message: "잘못된 요청" });
    }

    // hot 값을 boolean으로 변환
    const isHot = hot === "true";

    const posts = await postsInRangeByLocationTagWithBlock(
      locationId,
      tagId,
      lastPostId,
      size,
      isHot,
      userId
    );

    res.status(200).json({
      message: "Get posts in range",
      posts: await Promise.all(
        posts.map(async (post) => {
          const previewImageWithUrl =
            post.images.length > 0
              ? [
                  {
                    key: post.images[0],
                    url: await generateGetPresignedUrl(post.images[0]),
                  },
                ]
              : [];

          return {
            ...post.toObject(),
            author: {
              _id: post.author._id,
              nickname: post.author.nickname,
              location: post.author.location,
              deleted: post.author.deleted,
            },
            images: previewImageWithUrl, // 이미지가 없는 경우 빈 배열 반환
          };
        })
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 비회원 게시글 조회(댓글 포함)
async function getThisPost(req, res) {
  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const post = await thisPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 게시글 작성자의 프로필 이미지 URL 변환
    const postAuthorProfileImageData = post.author.profileImage
      ? {
          key: post.author.profileImage,
          url: await generateGetPresignedUrl(post.author.profileImage),
        }
      : null;

    // 게시글 작성자 데이터
    const postAuthorData = {
      ...post.author.toObject(),
      profileImage: postAuthorProfileImageData,
    };

    // 게시글 이미지 데이터 변환
    const postImageData =
      post.images && post.images.length > 0
        ? await Promise.all(
            post.images.map(async (imageKey) => ({
              key: imageKey,
              url: await generateGetPresignedUrl(imageKey),
            }))
          )
        : [];

    // 게시글 데이터
    const postData = {
      ...post.toObject(),
      author: postAuthorData,
      images: postImageData, // { key, url }을 담은 배열로 반환
      postLike: false, // 비회원은 false가 디폴트
      // 댓글 데이터 추가 예정
    };

    // 댓글 데이터
    const comments = await commentsOnThisPost(postId);

    const commentsMap = {};
    const nestedCommentsMap = {};

    // 댓글 처리
    await Promise.all(
      comments.map(async (comment) => {
        // 댓글 작성자 프로필 이미지 데이터
        const commentAuthorProfileImageData = comment.author.profileImage
          ? {
              key: comment.author.profileImage,
              url: await generateGetPresignedUrl(comment.author.profileImage),
            }
          : null;

        // 댓글 작성자 데이터
        const commentAuthorData = {
          ...comment.author.toObject(),
          profileImage: commentAuthorProfileImageData,
        };

        if (comment.parentComment) {
          // 대댓글인 경우
          if (!nestedCommentsMap[comment.parentComment]) {
            nestedCommentsMap[comment.parentComment] = [];
          }
          nestedCommentsMap[comment.parentComment].push({
            ...comment.toObject(),
            post: postData,
            author: commentAuthorData,
            commentLike: false,
          });
        } else {
          // 일반 댓글인 경우
          commentsMap[comment._id] = {
            ...comment.toObject(),
            post: postData,
            author: commentAuthorData,
            commentLike: false,
            nestedCommentsList: [],
          };
        }
      })
    );

    // 대댓글을 일반댓글에 넣어줌
    Object.keys(nestedCommentsMap).forEach((parentCommentId) => {
      if (commentsMap[parentCommentId]) {
        commentsMap[parentCommentId].nestedCommentsList =
          nestedCommentsMap[parentCommentId];
      }
    });

    // 게시글 데이터에 댓글 데이터 추가
    postData.commentsList = Object.values(commentsMap);

    res.status(200).json({
      message: "This post",
      post: postData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 게시글 조회 (로그인 기준, 댓글/대댓글 포함, 이미지 추가)
async function getThisPostWithLogin(req, res) {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.userId;

  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const post = await thisPost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 게시글 작성자의 프로필 이미지 URL 변환
    const postAuthorProfileImageData = post.author.profileImage
      ? {
          key: post.author.profileImage,
          url: await generateGetPresignedUrl(post.author.profileImage),
        }
      : null;

    // 게시글 작성자 데이터
    const postAuthorData = {
      ...post.author.toObject(),
      profileImage: postAuthorProfileImageData,
    };

    // 게시글 이미지 데이터 변환
    const postImageData =
      post.images && post.images.length > 0
        ? await Promise.all(
            post.images.map(async (imageKey) => ({
              key: imageKey,
              url: await generateGetPresignedUrl(imageKey),
            }))
          )
        : [];

    // 게시물 좋아요 여부 확인
    const postLikeData = await isLikedPost(postId, userId);

    // 게시글 데이터
    const postData = {
      ...post.toObject(),
      author: postAuthorData,
      images: postImageData, // { key, url }을 담은 배열로 반환
      postLike: postLikeData,
      // 댓글 데이터 추가 예정
    };

    // 댓글 데이터 (회원 기준)
    const comments = await commentsOnThisPostWithBlock(postId, userId);

    const commentMap = {};
    const nestedCommentsMap = {};

    // 댓글 좋아요 여부 확인
    let commentsLikes = {};
    for (let comment of comments) {
      commentsLikes[comment._id] = await isLikedComment(comment._id, userId);
    }

    await Promise.all(
      comments.map(async (comment) => {
        // 댓글 작성자 프로필 이미지 데이터
        const commentAuthorProfileImageData = comment.author.profileImage
          ? {
              key: comment.author.profileImage,
              url: await generateGetPresignedUrl(comment.author.profileImage),
            }
          : null;

        // 댓글 작성자 데이터
        const commentAuthorData = {
          ...comment.author.toObject(),
          profileImage: commentAuthorProfileImageData,
        };

        if (comment.parentComment) {
          // 대댓글인 경우
          if (!nestedCommentsMap[comment.parentComment]) {
            nestedCommentsMap[comment.parentComment] = [];
          }
          nestedCommentsMap[comment.parentComment].push({
            ...comment.toObject(),
            post: postData,
            author: commentAuthorData,
            commentLike: commentsLikes[comment._id] || false,
          });
        } else {
          // 일반 댓글인 경우
          commentMap[comment._id] = {
            ...comment.toObject(),
            post: postData,
            author: commentAuthorData,
            commentLike: commentsLikes[comment._id] || false,
            nestedCommentsList: [],
          };
        }
      })
    );

    // 대댓글을 일반댓글에 넣어줌
    Object.keys(nestedCommentsMap).forEach((parentCommentId) => {
      if (commentMap[parentCommentId]) {
        commentMap[parentCommentId].nestedCommentsList =
          nestedCommentsMap[parentCommentId];
      }
    });

    // 게시글 데이터에 댓글 데이터 추가
    postData.commentsList = Object.values(commentMap);

    res.status(200).json({
      message: "This post",
      post: postData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: 게시글 검색(비회원)
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
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
async function getPostsSearch(req, res) {
  const locationId = req.query.locationId;
  const keyword = req.query.keyword;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    if (!locationId || !keyword || !size) {
      return res.status(400).json({ message: "Bad request" });
    }

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
 * /posts/search/user:
 *   get:
 *     summary: 게시글 검색(회원전용/게시글차단반영)
 *     tags: [Posts]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
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
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
async function getPostsSearchWithLogin(req, res) {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.userId;

  const locationId = req.query.locationId;
  const keyword = req.query.keyword;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    if (!locationId || !keyword || !size) {
      return res.status(400).json({ message: "Bad request" });
    }

    const posts = await searchingPostsWithBlock(
      locationId,
      keyword,
      lastPostId,
      size,
      userId
    );
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
 *               contents:
 *                 type: array
 *               locationId:
 *                 type: string
 *               tagId:
 *                 type: string
 *               images:
 *                 type: array
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
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function postMyPost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const { title, contents, locationId, tagId, images } = req.body;

  if (!title || !contents || !locationId || !tagId) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  try {
    const post = await newPost(
      title,
      contents,
      userId,
      locationId,
      tagId,
      images
    );
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

// 게시글 수정
async function putMyPost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const postId = req.params.postId;
  const { title, contents, tagId, images } = req.body;
  try {
    const post = await modifyMyPost(
      postId,
      title,
      contents,
      userId,
      tagId,
      images
    );
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
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function deleteMyPost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

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
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function postLikePost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const postId = req.params.postId;
  try {
    const postLike = await likePost(postId, userId);
    await sendLikePush(userId, postId, null); // 게시글 좋아요는 commentId가 null
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
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function deleteLikePost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

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
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 에러
 */
async function postReportPost(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

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

/**
 * @swagger
 * /my/posts:
 *   get:
 *     summary: 내 게시글 가져오기
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: query
 *         name: lastPostId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 게시글 ID
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 게시글 수
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
 *                 countAllPosts:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: 서버 에러
 */
async function getMyPosts(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const { countAllPosts, posts } = await myPosts(userId, lastPostId, size);
    res.status(200).json({
      message: "My posts",
      countAllPosts,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user/{userId}/posts:
 *   get:
 *     summary: 유저 게시글 가져오기
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: query
 *         name: lastPostId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 게시글 ID
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 게시글 수
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
 *                 countAllPosts:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: 서버 에러
 */
async function getUserPosts(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.params.userId; // 헤더 토큰에 있는게 아니라 params에 있는 userId임
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const { countAllPosts, posts } = await userPosts(userId, lastPostId, size);
    res.status(200).json({
      message: "User's posts",
      countAllPosts,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /my/postlikes:
 *   get:
 *     summary: 내가 좋아요한 게시글 가져오기
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: query
 *         name: lastPostId
 *         schema:
 *           type: string
 *         description: 이전 페이지의 마지막 게시글 ID
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *         description: 한 페이지에 가져올 게시글 수
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
 *                 countAllPosts:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: 서버 에러
 */
async function getMyPostLikes(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const lastPostId = req.query.lastPostId;
  const size = req.query.size;
  try {
    const { countAllPosts, posts } = await myPostLikes(
      userId,
      lastPostId,
      size
    );
    res.status(200).json({
      message: "My posts",
      countAllPosts,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyPosts,
  getMyPostLikes,

  getUserPosts,

  postMyPost,
  getThisPost,
  putMyPost,
  deleteMyPost,
  postLikePost,
  deleteLikePost,
  getPostsInRange,
  getPostsSearch,
  postReportPost,
  getThisPostWithLogin,
  getPostsInRangeWithLogin,
  getPostsSearchWithLogin,
};
