const admin = require("../config/firebase");

async function generateFirebaseCustomToken(userId) {
  try {
    const customToken = await admin.getAuth().createCustomToken(userId);
    return customToken;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateFirebaseCustomToken,
};
