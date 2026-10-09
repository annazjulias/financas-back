import type { FastifyInstance } from "fastify";

import { authenticate } from "../middlewares/authenticate.js";

import {
  createCard,
  findCardsByUser,
  updateCard,
  deleteCard,
} from "../services/cardService.js";

export async function cardRoutes(server: FastifyInstance) {
  // POST - Criar cartão
  server.post(
    "/api/cards",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const {
        name,
        creditLimit,
        closingDay,
        dueDay,
      } = request.body as {
        name: string;
        creditLimit?: number;
        closingDay?: number;
        dueDay?: number;
      };

      if (!name) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome do cartão é obrigatório.",
        });
      }

      const card = await createCard({
        name,
        userId: request.userId,
        ...(creditLimit !== undefined && {
          creditLimit,
        }),
        ...(closingDay !== undefined && {
          closingDay,
        }),
        ...(dueDay !== undefined && {
          dueDay,
        }),
      });

      return reply.status(201).send(card);
    }
  );

  // GET - Listar cartões
  server.get(
    "/api/cards",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const cards = await findCardsByUser(request.userId);

      return cards;
    }
  );

  // PUT - Atualizar cartão
  server.put(
    "/api/cards/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const {
        name,
        creditLimit,
        closingDay,
        dueDay,
      } = request.body as {
        name: string;
        creditLimit?: number;
        closingDay?: number;
        dueDay?: number;
      };

      if (!name) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome do cartão é obrigatório.",
        });
      }

      const result = await updateCard(
        id,
        request.userId,
        {
          name,
          ...(creditLimit !== undefined && {
            creditLimit,
          }),
          ...(closingDay !== undefined && {
            closingDay,
          }),
          ...(dueDay !== undefined && {
            dueDay,
          }),
        }
      );

      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Cartão não encontrado.",
        });
      }

      return reply.send({
        message: "Cartão atualizado com sucesso.",
      });
    }
  );

  // DELETE - Excluir cartão
  server.delete(
    "/api/cards/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const result = await deleteCard(
        id,
        request.userId
      );

      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Cartão não encontrado.",
        });
      }

      return reply.send({
        message: "Cartão excluído com sucesso.",
      });
    }
  );
}