import { initializeApp, getApps, cert } from "firebase-admin/app";
import { initializeFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

export function initializeFirebaseAdmin() {
  const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
  const db = initializeFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  const auth = getAuth(app);

  return { app, db, auth };
}

// シングルトンとしてエクスポート
export const { db: adminFirestore, auth: adminAuth } = initializeFirebaseAdmin();
