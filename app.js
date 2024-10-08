const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");
const setupSwagger = require("./src/config/swagger");
const setupRoutes = require("./src/routes/routes");
const requestLogger = require("./src/middlewares/loggerMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(requestLogger); // Morgan 미들웨어 추가

setupMongo();
// setupSwagger(app);
setupRoutes(app);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
