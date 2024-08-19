const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupMongo = require("./src/config/mongoDB");
const setupSwagger = require("./src/config/swagger");
const setupRoutes = require("./src/routes/routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

setupMongo();
setupSwagger(app);
setupRoutes(app);

console.log("hello, flowin!");

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
