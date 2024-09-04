const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, json } = format;
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

// 로그 출력 형식 정의
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Winston Logger 생성
const logger = createLogger({
  level: "info", // 기본 로그 레벨
  format: combine(
    timestamp(), // 타임스탬프 추가
    logFormat, // 로그 출력 형식 적용
    json() // 로그를 JSON 형식으로 저장
  ),
  transports: [
    // 일별로 로그 파일을 회전하여 저장
    new DailyRotateFile({
      filename: path.join(__dirname, "../../logs/application-%DATE%.log"), // 로그 파일 경로 및 이름
      datePattern: "YYYY-MM-DD", // 일별로 파일을 회전
      zippedArchive: true, // 로그 파일 압축
      maxSize: "20m", // 파일 당 최대 크기 설정
      maxFiles: "14d", // 14일간 로그 파일 보관
    }),
    // 콘솔에도 로그를 출력 (개발 시 유용)
    new transports.Console({
      format: combine(timestamp(), logFormat),
    }),
  ],
});

// 오류 로그를 별도로 파일에 기록 (레벨: error)
logger.add(
  new transports.File({
    filename: path.join(__dirname, "../../logs/error.log"),
    level: "error",
  })
);

// 콘솔에도 로그를 출력 (개발 환경에서 유용)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

module.exports = logger;
