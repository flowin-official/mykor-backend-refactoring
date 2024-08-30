const mongoose = require("mongoose");
const setupMongo = require("../config/mongoDB"); // mongoDB.js 설정 파일
const Post = require("../models/post"); // Post 모델

// 더미 데이터
const users = [
  {
    _id: mongoose.Types.ObjectId("66c2f9ac6cbec92da7aa3182"),
    nickname: "test",
  },
  {
    _id: mongoose.Types.ObjectId("66c2f9df6cbec92da7aa3183"),
    nickname: "test2",
  },
  // 필요한 추가 사용자...
];

const tags = [
  {
    _id: mongoose.Types.ObjectId("66c870e39d6ae03a47389228"),
    name: "동네친구",
  },
  { _id: mongoose.Types.ObjectId("66c870e39d6ae03a47389229"), name: "맛집" },
  {
    _id: mongoose.Types.ObjectId("66c870e39d6ae03a4738922a"),
    name: "교환학생",
  },
  // 필요한 추가 태그...
];

const locations = [
  { _id: mongoose.Types.ObjectId("66c9906d599deca92032745d"), country: "미국" },
  { _id: mongoose.Types.ObjectId("66c9906d599deca92032745e"), country: "중국" },
  { _id: mongoose.Types.ObjectId("66c9906d599deca92032745f"), country: "일본" },
  // 필요한 추가 위치...
];

// 더미 포스트 생성 함수
const createDummyPosts = async () => {
  const posts = [];

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];

    const post = {
      title: `제목 ${i + 1}`,
      content: `이것은 ${i + 1}번째 게시물의 내용입니다.`,
      author: randomUser._id,
      location: randomLocation._id,
      tag: randomTag._id,
      views: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      created: new Date(),
      updated: new Date(),
    };

    posts.push(post);
  }

  try {
    await Post.insertMany(posts);
    console.log("50개의 더미 Post 데이터 생성 완료");
  } catch (error) {
    console.error("Post 데이터 생성 중 오류 발생:", error);
  }
};

// 메인 실행 함수
const main = async () => {
  await setupMongo(); // MongoDB 연결 설정
  await createDummyPosts(); // 더미 포스트 생성
  mongoose.connection.close(); // 데이터베이스 연결 종료
};

// 스크립트 실행
main().catch((error) => {
  console.error("메인 함수 실행 중 오류 발생:", error);
  mongoose.connection.close();
});
