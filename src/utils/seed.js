// 더미 데이터 생성

const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Comment } = require("../models/comment");
const { PostLike } = require("../models/postLike");
const { CommentLike } = require("../models/commentLike");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected...");

    // 기존 데이터 삭제
    // await User.deleteMany({});
    // await Post.deleteMany({});
    // await Comment.deleteMany({});
    // await PostLike.deleteMany({});
    // await CommentLike.deleteMany({});

    // 유저 생성
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push(
        new User({
          kakaoUserCode: `kakaoUserCode${i}`,
          userName: `User${i}`,
          userEmail: `user${i}@example.com`,
        })
      );
    }
    await User.insertMany(users);

    // 포스트 생성
    const posts = [];
    for (let i = 1; i <= 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      posts.push(
        new Post({
          title: `Post Title ${i}`,
          content: `This is the content for post ${i}`,
          author: randomUser._id,
          location: null, // 필요한 경우 location ID를 넣어야 합니다.
          tag: `tag${i}`,
          views: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
        })
      );
    }
    await Post.insertMany(posts);

    // 코멘트 생성
    const comments = [];
    for (let i = 1; i <= 30; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      comments.push(
        new Comment({
          postId: randomPost._id,
          userId: randomUser._id,
          content: `This is a comment for post ${randomPost.title}`,
          likes: Math.floor(Math.random() * 10),
        })
      );
    }
    await Comment.insertMany(comments);

    // 포스트 좋아요 생성
    const postLikes = [];
    for (let i = 1; i <= 40; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      postLikes.push(
        new PostLike({
          post_id: randomPost._id,
          user_id: randomUser._id,
        })
      );
    }
    await PostLike.insertMany(postLikes);

    // 코멘트 좋아요 생성
    const commentLikes = [];
    for (let i = 1; i <= 50; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomComment =
        comments[Math.floor(Math.random() * comments.length)];
      commentLikes.push(
        new CommentLike({
          commentId: randomComment._id,
          userId: randomUser._id,
        })
      );
    }
    await CommentLike.insertMany(commentLikes);

    console.log("Dummy data inserted");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
