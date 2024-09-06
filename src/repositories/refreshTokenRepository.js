const redisClient = require("../config/redisClient");

const saveRefreshToken = async (userId, refreshToken) => {
  await redisClient.set(userId.toString(), refreshToken);
};

// Redis 4.x 이상에서는 콜백 대신 프로미스 기반 API를 사용하므로 모든 명령을 await 비동기로 처리해야함.
const findRefreshToken = async (userId) => {
  return await redisClient.get(userId.toString());
};

const deleteRefreshToken = async (userId) => {
  await redisClient.del(userId.toString());
};

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
