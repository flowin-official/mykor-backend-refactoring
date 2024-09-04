// src/utils/logger.js

const { createLogger, transports, format } = require("winston");
const path = require("path");

// 로그 포맷 설정
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

// 로거 생성
const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
  ],
});

// 개발 환경에서는 콘솔에도 로그 출력
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

module.exports = logger;
