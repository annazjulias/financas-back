
import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

import { authenticate } from "./middlewares/authenticate.js";
import { inicializeFirebase } from "./config/firebaseAdmin.js";

import { categoryRoutes } from "./routes/categoryRoutes.js";
import { transactionRoutes } from "./routes/transactionRoutes.js";
import { paymentMethodRoutes } from "./routes/paymentMethodRoutes.js";
import { cardRoutes } from "./routes/cardRoutes.js";
import { invoiceRoutes } from "./routes/invoiceRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";

const server = Fastify({ logger: true });

const allowedOrigins = [
  "http://localhost:5173",
  "https://financas-front-khaki.vercel.app",
  "https://financas-front-l8lpob7vl-annazjulias-projects.vercel.app",
];

async function start() {
  try {
    inicializeFirebase();

    // CORS deve ser registrado antes das rotas.
    await server.register(cors, {
      origin: allowedOrigins,
      methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
      ],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
      ],
    });

    await server.register(categoryRoutes);
    await server.register(transactionRoutes);
    await server.register(paymentMethodRoutes);
    await server.register(cardRoutes);
    await server.register(invoiceRoutes);
    await server.register(dashboardRoutes);

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

    const port = Number(process.env.PORT) || 3001;

    await server.listen({
      port,
      host: "0.0.0.0",
    });

    server.log.info(`Servidor iniciado na porta ${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
