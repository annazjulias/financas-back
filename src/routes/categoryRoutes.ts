import type { FastifyInstance } from "fastify";

import { authenticate } from "../middlewares/authenticate.js";
import {
  createCategory,
  findCategoriesByUser,   updateCategory,deleteCategory
} from "../services/categoryService.js";

export async function categoryRoutes(server: FastifyInstance) {
  server.post(
    "/api/categories",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { name, type } = request.body as {
        name: string;
        type: string;
      };

      if (!name || !type) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome e tipo da categoria são obrigatórios.",
        });
      }

      const category = await createCategory({
        name,
        type,
        userId: request.userId,
      });

      return reply.status(201).send(category);
    }
  );
  server.delete(
    "/api/categories/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };
  
      const result = await deleteCategory(
        id,
        request.userId
      );
  
      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Categoria não encontrada.",
        });
      }
  
      return reply.send({
        message: "Categoria excluída com sucesso.",
      });
    }
  );
  server.put(
    "/api/categories/:id",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };
  
      const { name, type } = request.body as {
        name: string;
        type: string;
      };
  
      if (!name || !type) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "Nome e tipo da categoria são obrigatórios.",
        });
      }
  
      const result = await updateCategory(
        id,
        request.userId,
        {
          name,
          type,
        }
      );
  
      if (result.count === 0) {
        return reply.status(404).send({
          error: "Not Found",
          message: "Categoria não encontrada.",
        });
      }
  
      return reply.send({
        message: "Categoria atualizada com sucesso.",
      });
    }
  );
  server.get(
    "/api/categories",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const categories = await findCategoriesByUser(request.userId);

      return categories;
    }
  );
}