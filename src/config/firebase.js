const admin = require("firebase-admin");
const { FIREBASE_SERVICE_ACCOUNT_FILE, FIREBASE_DATABASE_URL } = process.env;

const serviceAccount = require(FIREBASE_SERVICE_ACCOUNT_FILE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DATABASE_URL,
});

async function generateFirebaseCustomToken(userId) {
  try {
    await admin.auth().createCustomToken(userId);
  } catch (error) {
    console.error("Error creating custom token:", error);
  }
}

// module.exports = admin;

module.exports = {
  generateFirebaseCustomToken,
};
