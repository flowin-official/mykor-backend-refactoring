const redis = require("redis");

const { REDIS_HOST, REDIS_PORT } = process.env;

const setupRedis = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  // Redis 4.x 버전에서는 url을 통해 연결
});

setupRedis.on("connect", () => {
  console.log("Connected to Redis");
});

setupRedis.on("ready", () => {
  console.log("Redis client ready");
});

setupRedis.on("end", () => {
  console.log("Redis client disconnected");
});

setupRedis.on("error", (err) => {
  console.error("Redis error", err);
});

(async () => {
  await setupRedis.connect();
})();

module.exports = setupRedis;
