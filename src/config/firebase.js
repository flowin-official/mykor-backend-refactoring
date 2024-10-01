const admin = require("firebase-admin");

const serviceAccount = require("../mykor-430210-firebase-adminsdk-u16ux-5202f74f52.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mykor-430210-default-rtdb.firebaseio.com",
});

module.exports = admin;
