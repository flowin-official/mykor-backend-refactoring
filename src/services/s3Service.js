const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const generatePresignedUrl = (key, operation) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // S3 버킷 이름
    Key: key, // 파일의 S3 키
    Expires: 60, // Presigned URL의 유효 기간 (기본: 60초)
  };

  if (operation === "getObject") {
    return s3.getSignedUrlPromise("getObject", params); // 읽기용 presigned URL
  } else if (operation === "putObject") {
    return s3.getSignedUrlPromise("putObject", params); // 쓰기용 presigned URL
  } else {
    throw new Error("Invalid operation type");
  }
};

module.exports = { generatePresignedUrl };
