import "dotenv/config";

import {
  firebaseAdminAuth,
  inicializeFirebase,
} from "./config/firebaseAdmin.js";

import prisma from "./config/prisma.js";

const createUser = async () => {
  try {
    inicializeFirebase();

    const firebaseUser = await firebaseAdminAuth().getUser(
      "fzJPYFACN4Ms8vORN7i5LMQjgJw1"
    );

    console.log("Usuário encontrado no Firebase:");
    console.log({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    });

    if (!firebaseUser.email) {
      throw new Error("O usuário do Firebase não possui e-mail.");
    }

    const user = await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
      },
    });

    console.log("Usuário criado no PostgreSQL!");
    console.log(user);
  } catch (error) {
    console.error("Erro ao criar usuário:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

createUser();