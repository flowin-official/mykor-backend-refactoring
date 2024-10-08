const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const generatePresignedUrl = (userId, purpose, count) => {
  let keys = [];
  if (purpose === "profile") {
    keys.push(`profile/${userId}`);
  } else if (purpose === "post") {
    for (let i = 0; i < count; i++) {
      keys.push(`post/${userId}/${Date.now()}_${i}`);
    }
  } else {
    throw new Error("Invalid purpose");
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // S3 버킷 이름
    Key: key, // 파일의 S3 키
    Expires: 60, // Presigned URL의 유효 기간 (기본: 60초)
  };

  const url = s3.getSignedUrl("putObject", params); // 쓰기용 presigned URL
  return { url, keys };
};

module.exports = { generatePresignedUrl };
