// src/middlewares/loggerMiddleware.js

const morgan = require("morgan");
const logger = require("../utils/logger");

// morgan을 이용한 HTTP 요청 로깅 미들웨어 설정
const morganMiddleware = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

module.exports = morganMiddleware;
