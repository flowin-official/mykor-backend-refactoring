const {
  generatePostPresignedUrl,
  generateProfilePresignedUrl,
} = require("../services/s3Service");

async function postPostPresignedUrl(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  try {
    const { count } = req.body;

    // presigned URL 생성
    const urls = await generatePostPresignedUrl(userId, count);

    return res.status(200).json(urls);
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}

async function postProfilePresignedUrl(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  try {
    // presigned URL 생성
    const url = await generateProfilePresignedUrl(userId);

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}

module.exports = {
  postPostPresignedUrl,
  postProfilePresignedUrl,
};
