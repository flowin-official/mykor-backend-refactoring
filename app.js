const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");
const setupSwagger = require("./src/config/swagger");

const authRoutes = require("./src/routes/authRoutes");
// const apiRoutes = require("./src/routes/apiRoutes");

const app = express();

const serverPort = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// MongoDB 연결
setupMongo();

// Swagger 설정
setupSwagger(app, serverPort);

// 라우트 설정
// app.use("/mykor/api/v1", apiRoutes);
app.use("/mykor", authRoutes);

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
