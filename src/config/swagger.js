const dotenv = require("dotenv");
dotenv.config();

const { SWAGGER_ADDRESS, SERVER_PORT } = process.env;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MyKor API",
    version: "1.0.0",
    description: "API documentation for the MyKor project",
  },
  servers: [
    {
      url: `http://${SWAGGER_ADDRESS}:${SERVER_PORT}/mykor/api/v1`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  // app.use("/mykor/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
