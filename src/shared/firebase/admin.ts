import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { resolveFirestoreDatabaseId } from "./firestore-database";

function getPrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    getFirebaseProjectId() &&
      (process.env.FIREBASE_CLIENT_EMAIL || process.env.GOOGLE_APPLICATION_CREDENTIALS),
  );
}

function getCredential() {
  const projectId = getFirebaseProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (projectId && clientEmail && privateKey) {
    return cert({ projectId, clientEmail, privateKey });
  }

  return applicationDefault();
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin config is missing.");
  }

  return (
    getApps()[0] ??
    initializeApp({
      credential: getCredential(),
      projectId: getFirebaseProjectId(),
      storageBucket: getFirebaseStorageBucket(),
    })
  );
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp(), getFirestoreDatabaseId());
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}

function getFirestoreDatabaseId() {
  return resolveFirestoreDatabaseId(
    process.env.FIREBASE_FIRESTORE_DATABASE_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID,
  );
}

function getFirebaseProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function getFirebaseStorageBucket() {
  return process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
}
