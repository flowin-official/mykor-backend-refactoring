const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");

const authRoutes = require("./src/routes/authRoutes");
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();

app.use(bodyParser.json());
// app.use(cors());

// MongoDB 연결
setupMongo();

// 라우트 설정
app.use("/mykor/api/v1", apiRoutes);
app.use("/mykor", authRoutes); // protected된 라우트

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
