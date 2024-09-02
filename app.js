const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");
const setupSwagger = require("./src/config/swagger");
const setupRoutes = require("./src/routes/routes");
const logger = require("./src/config/winston"); // Winston 로거 가져오기
const morganMiddleware = require("./src/middlewares/morgan"); // Morgan 미들웨어 가져오기

const app = express();

app.use(bodyParser.json());
app.use(cors());

setupMongo();
setupSwagger(app);
setupRoutes(app);

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server is running on port ${process.env.SERVER_PORT}`);
});
