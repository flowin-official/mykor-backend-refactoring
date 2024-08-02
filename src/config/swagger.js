const dotenv = require("dotenv");
dotenv.config();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const IP = process.env.IP_ADDRESS;

const setupSwagger = (app, serverPort) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MyKor-beta API",
        version: "1.0.0",
        description: "API documentation for the MyKor application",
      },
      servers: [
        {
          url: `http://${IP}:${serverPort}/mykor/api/v1`,
        },
      ],
    },
    apis: ["./src/controllers/*.js"],
  };

  const specs = swaggerJsDoc(options);
  app.use("/mykor/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
