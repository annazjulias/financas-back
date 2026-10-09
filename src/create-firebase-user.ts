import "dotenv/config";

import {
  firebaseAdminAuth,
  inicializeFirebase,
} from "./config/firebaseAdmin.js";

const createFirebaseUser = async () => {
  try {
    inicializeFirebase();

    const user = await firebaseAdminAuth().createUser({
      email: "teste@financas.com",
      password: "12345678",
    });

    console.log("Usuário criado no Firebase!");
    console.log({
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao criar usuário no Firebase:");
    console.error(error);
    process.exit(1);
  }
};

createFirebaseUser();