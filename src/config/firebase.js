const admin = require("firebase-admin");

const serviceAccount = require("../mykor-430210-firebase-adminsdk-u16ux-1622a15330.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mykor-430210-default-rtdb.firebaseio.com",
});

module.exports = admin;
