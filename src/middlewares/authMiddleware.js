const { verifyAccessToken } = require("../utils/jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer Token
  if (!token) {
    req.isAuthenticated = false;
    return next(); // 토큰이 없어서 인증에 실패
  }

  verifyAccessToken(token, (err, decoded) => {
    if (err) {
      req.isAuthenticated = false;
      return next(); // 토큰이 유효하지 않아 인증에 실패
    }
    req.isAuthenticated = true;
    req.userId = decoded.id; // 페이로드에 저장된 id
    next();
  });
}

module.exports = authenticateToken;
