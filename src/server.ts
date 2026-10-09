import Fastify from "fastify";
import cors from "@fastify/cors";

import { authenticate } from "./middlewares/authenticate.js";
import { inicializeFirebase } from "./config/firebaseAdmin.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { transactionRoutes } from "./routes/transactionRoutes.js";
import { paymentMethodRoutes } from "./routes/paymentMethodRoutes.js";
import { cardRoutes } from "./routes/cardRoutes.js";
import { invoiceRoutes } from "./routes/invoiceRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";

import "dotenv/config";

const server = Fastify({ logger: true });

inicializeFirebase();


await server.register(cors, {
  origin: ["http://localhost:5173",
  "financas-front-l8lpob7vl-annazjulias-projects.vercel.app",],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
server.register(categoryRoutes);
server.register(transactionRoutes);
server.register(paymentMethodRoutes);
server.register(cardRoutes);
server.register(invoiceRoutes);
server.register(dashboardRoutes);

server.get("/health", async () => ({
  status: "ok",
  message: "API funcionando",
}));

server.get(
  "/auth/test",
  { preHandler: authenticate },
  async (request) => ({
    authenticated: true,
    userId: request.userId,
  })
);

const start = async () => {
  try {
    await server.listen({
      port: 3001,
      host: "0.0.0.0",
    });

    console.log(
      "Servidor rodando em http://localhost:3001"
    );
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();