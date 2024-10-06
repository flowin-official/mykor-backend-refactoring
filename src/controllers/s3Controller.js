const { generatePresignedUrl } = require("../services/s3Service");

async function getPresignedUrl(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const userId = req.userId;

  try {
    const { key, operation } = req.body;

    // presigned URL 생성
    const url = await generatePresignedUrl(key, operation, expiresIn);

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}

module.exports = {
  getPresignedUrl,
};
