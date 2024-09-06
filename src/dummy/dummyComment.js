const mongoose = require("mongoose");
const Comment = require("../models/comment"); // Comment 모델 임포트
const Post = require("../models/post"); // Post 모델 임포트

// 전체 user, tag, location 데이터를 반영
const users = [
  {
    _id: new mongoose.Types.ObjectId("66c2f9ac6cbec92da7aa3182"),
    kakaoUserCode: "1",
    nickname: "test",
  },
  {
    _id: new mongoose.Types.ObjectId("66c2f9df6cbec92da7aa3183"),
    kakaoUserCode: "2",
    nickname: "test2",
  },
  // 더 많은 사용자가 있다면 여기에 추가...
];

async function postDummyComment(req, res) {
  try {
    const posts = await Post.find(); // DB에서 모든 포스트를 가져옴
    const comments = [];

    posts.forEach((post) => {
      // 각 포스트마다 0~50개의 댓글 생성
      const numberOfComments = Math.floor(Math.random() * 51);

      for (let i = 0; i < numberOfComments; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const comment = new Comment({
          post: post._id,
          author: randomUser._id,
          content: `This is a dummy comment by ${randomUser.nickname} on post ${post._id}`,
          likes: 0,
        });
        comments.push(comment);
      }
    });

    await Comment.insertMany(comments); // 생성된 모든 댓글을 DB에 저장

    res
      .status(201)
      .json({ message: `${comments.length} comments have been created.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create dummy comments." });
  }
}

async function deleteDummyComment(req, res) {
  try {
    const result = await Comment.deleteMany(); // DB에 있는 모든 댓글 삭제
    res
      .status(200)
      .json({ message: `${result.deletedCount} comments have been deleted.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comments." });
  }
}

module.exports = { postDummyComment, deleteDummyComment };
