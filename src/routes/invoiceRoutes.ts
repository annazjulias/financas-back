import type { FastifyInstance } from "fastify";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createInvoice,
  findInvoicesByUser,
  findInvoiceById,
  payInvoice,
} from "../services/invoiceService.js";

export async function invoiceRoutes(server: FastifyInstance) {
  server.post(
    "/api/invoices",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const body = request.body as {
          cardId: string;
          reference: string;
          closingDate: string;
          dueDate: string;
        };
        if (
          !body.cardId ||
          !body.reference ||
          !body.closingDate ||
          !body.dueDate
        ) {
          return reply.status(400).send({
            message:
              "Cartão, referência, data de fechamento e data de vencimento são obrigatórios.",
          });
        }

        const invoice = await createInvoice(
          {
            cardId: body.cardId,
            reference: body.reference,
            closingDate: new Date(body.closingDate),
            dueDate: new Date(body.dueDate),
          },
          request.userId
        );

        return reply.status(201).send(invoice);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Cartão não encontrado."
        ) {
          return reply.status(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.status(500).send({
          message: "Erro ao criar fatura.",
        });
      }
    }
  );

server.put(
  "/api/invoices/:id/pay",
  { preHandler: authenticate },
  async (request, reply) => {
    try {
      const params = request.params as {
        id: string;
      };

      const invoice = await payInvoice(
        params.id,
        request.userId
      );

      return reply.send(invoice);
    } catch (error) {
      if (
        error instanceof Error &&
        (
          error.message === "Fatura não encontrada." ||
          error.message === "Esta fatura já está paga."
        )
      ) {
        return reply.status(400).send({
          message: error.message,
        });
      }

      request.log.error(error);

      return reply.status(500).send({
        message: "Erro ao pagar fatura.",
      });
    }
  }
);


  server.get(
    "/api/invoices",
    { preHandler: authenticate },
    async (request) => {
      return findInvoicesByUser(request.userId);
    }
  );

  server.get(
    "/api/invoices/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      const params = request.params as {
        id: string;
      };

      const invoice = await findInvoiceById(
        params.id,
        request.userId
      );

      if (!invoice) {
        return reply.status(404).send({
          message: "Fatura não encontrada.",
        });
      }

      return invoice;
    }
  );
}