// 필요한 모듈 임포트
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// S3 클라이언트 생성
const s3 = new S3Client({ region: process.env.AWS_REGION });

const generatePutPresignedUrl = async (userId, purpose, count) => {
  let urls = [];

  for (let i = 0; i < count; i++) {
    let key = "";
    if (purpose === "profile") {
      key = `profile/${userId}`;
    } else if (purpose === "post") {
      key = `post/${userId}/${Date.now()}_${i}`;
    } else {
      throw new Error("Invalid purpose");
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET, // S3 버킷 이름
      Key: key, // 파일의 S3 키
    };

    // PutObjectCommand와 getSignedUrl을 사용하여 presigned URL 생성
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 유효기간 60초
    urls.push({ url, key });
  }
  return urls;
};

const generateGetPresignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // S3 버킷 이름
    Key: key, // 파일의 S3 키
  };

  // GetObjectCommand와 getSignedUrl을 사용하여 presigned URL 생성
  const command = new GetObjectCommand(params);
  return await getSignedUrl(s3, command, { expiresIn: 60 }); // 유효기간 60초
};

module.exports = { generatePutPresignedUrl, generateGetPresignedUrl };
