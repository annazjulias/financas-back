import "dotenv/config";

import { firebaseAdminAuth, inicializeFirebase } from "./config/firebaseAdmin.js";

const testFirebase = async () => {
  try {
    inicializeFirebase();

    const result = await firebaseAdminAuth().listUsers(10);

    console.log("Conexão com Firebase Admin funcionando!");
    console.log("Usuários encontrados:", result.users.length);

    for (const user of result.users) {
      console.log({
        uid: user.uid,
        email: user.email,
      });
    }
  } catch (error) {
    console.error("Erro ao conectar com Firebase Admin:");
    console.error(error);
    process.exit(1);
  }
};

testFirebase();