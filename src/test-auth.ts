import "dotenv/config";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyAq865Vq-nO5GRAcOwizARyoNLgthpcFG8",
  authDomain: "gerenciadorfinanceiro-80239.firebaseapp.com",
  projectId: "gerenciadorfinanceiro-80239",
  storageBucket: "gerenciadorfinanceiro-80239.firebasestorage.app",
  messagingSenderId: "956347207170",
  appId: "1:956347207170:web:52c26f7271ea2db19ae11b",
  measurementId: "G-ZSNVDBDXR4"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const testAuth = async () => {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      "teste@financas.com",
      "12345678"
    );

    const token = await credential.user.getIdToken();
    console.log("ID Token:");
    console.log(token);
    console.log("Login no Firebase realizado!");
    console.log("UID:", credential.user.uid);

    const response = await axios.get(
      "http://localhost:3001/auth/test",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Resposta da API:");
    console.log(response.data);
  } catch (error: any) {
    console.error("Erro no teste de autenticação:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

testAuth();