const admin = require("../config/firebase");

async function generateFirebaseCustomToken(userId) {
  return await admin.auth().createCustomToken(userId);
}

module.exports = {
  generateFirebaseCustomToken,
};
