const {
  myInfo,
  modifyMyInfo,
  removeMyInfo,
  userInfo,
  newBlockUser,
} = require("../services/userService");

const { deleteAppleUser } = require("../services/authService");
const { generateGetPresignedUrl } = require("../services/s3Service");

async function getMyInfo(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  try {
    const user = await myInfo(userId);
    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function putMyInfo(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const { nickname, locationId, profileImage } = req.body;
  try {
    const user = await modifyMyInfo(userId, nickname, locationId, profileImage);
    res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMyInfo(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const appleAuthCode = req.query.appleAuthCode;
  try {
    if (appleAuthCode) {
      const apple_res = await deleteAppleUser(appleAuthCode);
      if (apple_res.status != 200)
        throw new Error("apple revoke failed" + apple_res.body);
      console.log("apple revoke success!");
    }
    await removeMyInfo(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserInfo(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.params.userId; // 헤더의 유저가 아니라 params의 유저 정보를 가져옴
  try {
    const user = await userInfo(userId);

    let profileImageUrl = null;
    if (user.profileImage) {
      profileImageUrl = await generateGetPresignedUrl(user.profileImage);
    }

    res.status(200).json({
      message: "User found",
      user: {
        _id: user._id,
        nickname: user.nickname,
        location: user.location,
        deleted: user.deleted,
        profileImage: profileImageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /user/{blockedUserId}/block:
 *   post:
 *     summary: 유저 차단
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blockedUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 유저 차단 성공
 *       401:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
async function postBlockUser(req, res) {
  if (!req.isAuthenticated) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const userId = req.userId;
  const blockedUserId = req.params.blockedUserId;
  try {
    await newBlockUser(userId, blockedUserId);
    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
  getUserInfo,
  postBlockUser,
};
