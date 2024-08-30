const mongoose = require("mongoose");
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

const tags = [
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389228"),
    name: "동네친구",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389229"),
    name: "맛집",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922a"),
    name: "교환학생",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922b"),
    name: "동행",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922c"),
    name: "취업",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922d"),
    name: "여행",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922e"),
    name: "유학생",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a4738922f"),
    name: "부동산",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389230"),
    name: "자동차",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389231"),
    name: "법률",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389232"),
    name: "이민",
  },
  {
    _id: new mongoose.Types.ObjectId("66c870e39d6ae03a47389233"),
    name: "기타",
  },
];

const locations = [
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032745d"),
    country: "미국",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032745e"),
    country: "중국",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032745f"),
    country: "일본",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327460"),
    country: "캐나다",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327461"),
    country: "베트남",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327462"),
    country: "우즈베키스탄",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327463"),
    country: "호주",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327464"),
    country: "러시아",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327465"),
    country: "카자흐스탄",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327466"),
    country: "독일",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327467"),
    country: "브라질",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327468"),
    country: "영국",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327469"),
    country: "필리핀",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746a"),
    country: "뉴질랜드",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746b"),
    country: "프랑스",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746c"),
    country: "인도네시아",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746d"),
    country: "아르헨티나",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746e"),
    country: "싱가포르",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032746f"),
    country: "태국",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327470"),
    country: "키르기즈공화국",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327471"),
    country: "멕시코",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327472"),
    country: "말레이시아",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327473"),
    country: "스웨덴",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327474"),
    country: "우크라이나",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327475"),
    country: "인도",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327476"),
    country: "네덜란드",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327477"),
    country: "아랍에미리트",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327478"),
    country: "덴마크",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca920327479"),
    country: "캄보디아",
    details: null,
  },
  {
    _id: new mongoose.Types.ObjectId("66c9906d599deca92032747a"),
    country: "노르웨이",
    details: null,
  },
];

// 더미 포스트 생성 함수
async function postDummyPost(req, res) {
  const posts = [];

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    const randomLocation = locations[0]; // 미국에만 50개
    // locations[Math.floor(Math.random() * locations.length)];

    const post = {
      title: `제목 ${i + 1}`,
      content: `이것은 ${i + 1}번째 게시물의 내용입니다.`,
      author: randomUser._id,
      location: randomLocation._id,
      tag: randomTag._id,
      views: 0, // 초기값 0
      likes: 0, // 초기값 0
      comments: 0, // 초기값 0
      created: new Date(),
      updated: new Date(),
    };

    posts.push(post);
  }

  try {
    await Post.insertMany(posts);
    console.log("더미 Post 데이터 생성 완료");
    res.status(201).json({ message: "더미 Post 데이터 생성 완료" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Post 데이터 생성 중 오류 발생:", error);
  }
}

async function deleteDummyPost(req, res) {
  try {
    await Post.deleteMany({});
    console.log("더미 Post 데이터 삭제 완료");
    res.status(200).json({ message: "더미 Post 데이터 삭제 완료" });
  } catch (error) {
    console.error("Post 데이터 삭제 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postDummyPost,
  deleteDummyPost,
};
