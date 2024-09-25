const expressWinston = require("express-winston");
const logger = require("../utils/logger");

// 클라이언트 IP 추출을 위한 유틸리티 함수
const getClientIp = (req) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    // X-Forwarded-For 헤더가 존재하는 경우 첫 번째 IP 가져오기
    return xForwardedFor.split(",")[0].trim();
  }
  // 프록시 환경이 아니면 req.ip 사용
  return req.ip || req.connection.remoteAddress;
};

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true, // 요청 메타데이터를 포함하여 기록
  msg: (req, res) => {
    const clientIp = getClientIp(req);
    return `HTTP ${req.method} ${req.url} - IP: ${clientIp} - User-Agent: ${req.headers["user-agent"]}`;
  },
  expressFormat: true, // express 포맷 사용 (요청 메서드와 URL을 포함)
  colorize: false, // 콘솔 출력 시 색상 사용 여부
  requestWhitelist: [...expressWinston.requestWhitelist, "body"], // 요청의 body를 포함
  responseWhitelist: ["body"], // 응답의 body를 포함
  requestFilter: (req, propName) => {
    // 요청 필터링 (필요 시 특정 속성 제외)
    if (propName === "headers") {
      return undefined; // 헤더 정보는 제외
    }
    return req[propName];
  },
  responseFilter: (res, propName) => {
    // 응답 필터링 (필요 시 특정 속성 제외)
    return res[propName];
  },
  ignoreRoute: function (req, res) {
    return false;
  }, // 로그를 무시할 경로 설정
});

module.exports = requestLogger;
