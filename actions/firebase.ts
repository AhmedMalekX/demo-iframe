"use server";

import * as admin from "firebase-admin";

export const getFireStore = async () => {
  let firebaseAdmin = admin.apps.find((app) => app!.name === "server-app");

  if (!firebaseAdmin) {
    firebaseAdmin = admin.initializeApp(
      {
        credential: admin.credential.cert(
          JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!),
        ),
      },
      "server-app",
    );
  }

  const db = await firebaseAdmin.firestore();

  return db;
};
