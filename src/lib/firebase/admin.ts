import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, '\n') : undefined;

if (!projectId || !clientEmail || !privateKey) {
  // Hinweis: Wir werfen bewusst keinen Fehler beim Import, damit Build/SSR nicht crasht.
  // Die Route sollte jedoch prüfen und sinnvolle Fehlermeldungen liefern.
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

export const adminAuth = getAuth(app);
