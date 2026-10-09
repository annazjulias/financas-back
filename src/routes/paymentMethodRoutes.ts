import type { FastifyInstance } from "fastify";

import { authenticate } from "../middlewares/authenticate.js";

import {
  createPaymentMethod,
  findPaymentMethodsByUser,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentMethodService.js";





export async function paymentMethodRoutes(
  server: FastifyInstance
) {
  server.post(
    "/api/payment-methods",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { name } = request.body as {
        name: string;
      };

      if (!name) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome da forma de pagamento é obrigatório.",
        });
      }

      const paymentMethod = await createPaymentMethod({
        name,
        userId: request.userId,
      });

      return reply.status(201).send(paymentMethod);
    }
  );

  server.get(
    "/api/payment-methods",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const paymentMethods = await findPaymentMethodsByUser(
        request.userId
      );

      return paymentMethods;
    }
  );server.put(
    "/api/payment-methods/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };
  
      const { name } = request.body as {
        name: string;
      };
  
      if (!name) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome da forma de pagamento é obrigatório.",
        });
      }
  
      const result = await updatePaymentMethod(
        id,
        request.userId,
        name
      );
  
      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Forma de pagamento não encontrada.",
        });
      }
  
      return reply.send({
        message: "Forma de pagamento atualizada com sucesso.",
      });
    }
  );server.delete(
    "/api/payment-methods/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };
  
      const result = await deletePaymentMethod(
        id,
        request.userId
      );
  
      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Forma de pagamento não encontrada.",
        });
      }
  
      return reply.send({
        message: "Forma de pagamento excluída com sucesso.",
      });
    }
  );
}