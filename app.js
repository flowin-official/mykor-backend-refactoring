const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");

const setupRoutes = require("./src/routes/routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB 연결
setupMongo();

// 라우트 설정
setupRoutes(app);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
