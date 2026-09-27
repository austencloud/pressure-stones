// Shared firebase-admin setup for the feedback scripts. firebase-admin is not
// bound by the Firestore security rules, so these scripts can read and delete
// feedback that the app itself cannot.
//
// Credentials, in this order:
//   1. scripts/service-account.json (gitignored). Firebase console > Project
//      settings > Service accounts > Generate new private key.
//   2. Application Default Credentials: gcloud auth application-default login
import { existsSync, readFileSync } from 'node:fs';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountFile = new URL('./service-account.json', import.meta.url);

initializeApp({
  projectId: 'pressurestones-2c455',
  credential: existsSync(serviceAccountFile)
    ? cert(JSON.parse(readFileSync(serviceAccountFile, 'utf8')))
    : applicationDefault()
});

export const db = getFirestore();
