const admin = require("../config/firebase");

async function generateFirebaseCustomToken(userId) {
  try {
    const customToken = await admin.auth().createCustomToken(userId);
    return customToken;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateFirebaseCustomToken,
};
