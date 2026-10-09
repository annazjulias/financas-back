import type { FastifyReply, FastifyRequest } from "fastify";
import { firebaseAdminAuth } from "../config/firebaseAdmin.js";
import { findOrCreateUser } from "../services/userService.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Token de autenticação não informado.",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Formato do token inválido.",
      });
    }

    const token = authorization.substring(7);

    if (!token) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Token de autenticação vazio.",
      });
    }

    const decodedToken = await firebaseAdminAuth().verifyIdToken(token);

    if (!decodedToken.uid) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Usuário não identificado.",
      });
    }

    if (!decodedToken.email) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Usuário não possui e-mail.",
      });
    }

    const user = await findOrCreateUser(
      decodedToken.uid,
      decodedToken.email
    );

    request.userId = user.id;
  } catch (error) {
    console.error("ERRO REAL DO FIREBASE ADMIN:");
    console.error(error);
  
    request.log.error(error);
  
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token de autenticação inválido ou expirado.",
    });
  }
}