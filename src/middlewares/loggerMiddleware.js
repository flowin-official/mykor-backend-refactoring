const expressWinston = require("express-winston");
const logger = require("../utils/logger");

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true, // 요청 메타데이터를 포함하여 기록
  msg: "HTTP {{req.method}} {{req.url}}", // 기본 로그 메시지
  expressFormat: true, // express 포맷 사용 (요청 메서드와 URL을 포함)
  colorize: false, // 콘솔 출력 시 색상 사용 여부
  requestWhitelist: [...expressWinston.requestWhitelist, "body"], // 요청의 body를 포함
  responseWhitelist: ["body"], // 응답의 body를 포함
  requestFilter: (req, propName) => {
    // 요청 필터링 (필요 시 특정 속성 제외)
    if (propName === "headers") {
      // 예시: 헤더 정보를 제거하고 싶을 때
      return undefined;
    }
    return req[propName];
  },
  responseFilter: (res, propName) => {
    // 응답 필터링 (필요 시 특정 속성 제외)
    return res[propName];
  },
});

module.exports = requestLogger;
