import type { FastifyInstance } from "fastify";
import { authenticate } from "../middlewares/authenticate.js";
import { getDashboardSummary } from "../services/dashboardService.js";

function getPeriod(
  month?: number,
  year?: number
) {
  const now = new Date();

  const selectedYear = year ?? now.getFullYear();
  const selectedMonth = month ?? now.getMonth() + 1;

  const startDate = new Date(
    selectedYear,
    selectedMonth - 1,
    1
  );

  const endDate = new Date(
    selectedYear,
    selectedMonth,
    1
  );

  return {
    startDate,
    endDate,
  };
}

export async function dashboardRoutes(
  server: FastifyInstance
) {
  server.get(
    "/api/dashboard/summary",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      try {
        const query = request.query as {
          month?: string;
          year?: string;
        };

        const month = query.month
          ? Number(query.month)
          : undefined;

        const year = query.year
          ? Number(query.year)
          : undefined;

        if (
          month !== undefined &&
          (!Number.isInteger(month) ||
            month < 1 ||
            month > 12)
        ) {
          return reply.status(400).send({
            error: "Bad Request",
            message: "Mês inválido.",
          });
        }

        if (
          year !== undefined &&
          (!Number.isInteger(year) ||
            year < 2000 ||
            year > 2100)
        ) {
          return reply.status(400).send({
            error: "Bad Request",
            message: "Ano inválido.",
          });
        }

        const { startDate, endDate } = getPeriod(
          month,
          year
        );

        const dashboard = await getDashboardSummary({
          userId: request.userId,
          startDate,
          endDate,
        });

        return reply.send(dashboard);
      } catch (error) {
        server.log.error(error);

        return reply.status(500).send({
          error: "Internal Server Error",
          message: "Erro ao carregar o resumo financeiro.",
        });
      }
    }
  );
}