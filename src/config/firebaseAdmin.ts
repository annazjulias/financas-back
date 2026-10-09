import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const inicializeFirebase = (): void => {
  if (getApps().length > 0) {
    return;
  }

  const {
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PROJECT_ID,
  } = process.env;

  if (
    !FIREBASE_PRIVATE_KEY ||
    !FIREBASE_CLIENT_EMAIL ||
    !FIREBASE_PROJECT_ID
  ) {
    throw new Error(
      "Falha ao conectar ao Firebase: variáveis de ambiente não configuradas."
    );
  }

  try {
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });

    console.log("Firebase connected");
  } catch (err) {
    console.error("Error initializing Firebase", err);
    process.exit(1);
  }
};

const firebaseAdminAuth = () => getAuth();

export { inicializeFirebase, firebaseAdminAuth };