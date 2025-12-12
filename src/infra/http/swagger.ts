import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options: swaggerJsDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Game Review API",
        version: "1.0.0",
        description: "API REST para avaliacao de jogos (Node.js + TypeScript + Prisma + JWT)."
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    },
    apis: ["src/routes/*.ts", "dist/routes/*.js"]
  };
  const swaggerSpec = swaggerJsDoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
