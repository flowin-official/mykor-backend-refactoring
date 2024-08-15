const { verifyAccessToken } = require("../utils/jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer Token
  if (!token) return res.status(403).json({ message: "No token provided" });

  verifyAccessToken(token, (err, decoded) => {
    if (err)
      return res.status(500).json({ message: "Failed to authenticate token" });
    req.userId = decoded.id; // 페이로드에 저장된 id
    next();
  });
}

module.exports = authenticateToken;
