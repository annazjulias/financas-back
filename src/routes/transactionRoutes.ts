import type { FastifyInstance } from "fastify";

import { authenticate } from "../middlewares/authenticate.js";

import {
  createTransaction,
  findTransactionsByUser,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService.js";

export async function transactionRoutes(server: FastifyInstance) {
  // POST - Criar transação
  server.post(
    "/api/transactions",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const body = request.body as {
          description: string;
          amount: number;
          date: string;
          type: string;
          categoryId?: string;
          paymentMethodId?: string;
          cardId?: string;
          installments?: number;
        };
  
        const transaction = await createTransaction({
          description: body.description,
          amount: body.amount,
          date: new Date(body.date),
          type: body.type,
          userId: request.userId,
          ...(body.categoryId && {
            categoryId: body.categoryId,
          }),
          ...(body.paymentMethodId && {
            paymentMethodId: body.paymentMethodId,
          }),
          ...(body.cardId && {
            cardId: body.cardId,
          }),
          ...(body.installments !== undefined && {
            installments: body.installments,
          }),
        });
  
        return reply.code(201).send(transaction);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao criar transação.";
  
        return reply.code(400).send({
          message,
        });
      }
    }
  );

  // GET - Listar transações
  server.get(
    "/api/transactions",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const transactions = await findTransactionsByUser(
        request.userId
      );

      return transactions;
    }
  );

  // PUT - Atualizar transação
  server.put(
    "/api/transactions/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const {
        description,
        amount,
        date,
        type,
        categoryId,
        paymentMethodId,
        cardId,
      } = request.body as {
        description: string;
        amount: number;
        date: string;
        type: string;
        categoryId?: string;
        paymentMethodId?: string;
        cardId?: string;
      };

      if (
        !description ||
        amount === undefined ||
        !date ||
        !type
      ) {
        return reply.status(400).send({
          error: "Bad Request",
          message:
            "Descrição, valor, data e tipo são obrigatórios.",
        });
      }

      try {
        const result = await updateTransaction(
          id,
          request.userId,
          {
            description,
            amount,
            date: new Date(date),
            type,
            ...(categoryId && {
              categoryId,
            }),
            ...(paymentMethodId && {
              paymentMethodId,
            }),
            ...(cardId && {
              cardId,
            }),
          }
        );

        if (!result) {
          return reply.status(404).send({
            error: "Not Found",
            message: "Transação não encontrada.",
          });
        }

        return reply.send({
          message: "Transação atualizada com sucesso.",
        });
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(400).send({
            error: "Bad Request",
            message: error.message,
          });
        }
      
        return reply.status(500).send({
          error: "Internal Server Error",
          message: "Erro ao atualizar transação.",
        });
      }
    }
  );

    
  server.delete(
    "/api/transactions/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
  
        const result = await deleteTransaction(
          id,
          request.userId
        );
  
        if (!result) {
          return reply.code(404).send({
            message: "Transação não encontrada.",
          });
        }
  
        return reply.send({
          message: "Transação excluída com sucesso.",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao excluir transação.";
  
        return reply.code(400).send({
          message,
        });
      }
    }
  );
}