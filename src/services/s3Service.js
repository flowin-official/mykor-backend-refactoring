// 필요한 모듈 임포트
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// S3 클라이언트 생성
const s3 = new S3Client({ region: process.env.AWS_REGION });

const generateProfilePresignedUrl = async (userId) => {
  const key = `profile/${userId}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // S3 버킷 이름
    Key: key, // 파일의 S3 키
  };

  // PutObjectCommand와 getSignedUrl을 사용하여 presigned URL 생성
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 유효기간 60초
  return { url, key };
};

const generatePostPresignedUrl = async (userId, count) => {
  let urls = [];

  for (let i = 0; i < count; i++) {
    const key = `post/${userId}/${Date.now()}_${i}`;

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

module.exports = {
  generatePostPresignedUrl,
  generateProfilePresignedUrl,
  generateGetPresignedUrl,
};
