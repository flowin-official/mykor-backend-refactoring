const admin = require("../config/firebase");

async function generateFirebaseToken(userId) {
  try {
    const fct = await admin.auth().createCustomToken(userId);
    return fct;
  } catch (error) {
    console.log("Error creating custom token:", error);
  }
}

module.exports = {
  generateFirebaseToken,
};
