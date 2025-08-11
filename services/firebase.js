// services/firebase.js
const admin = require('firebase-admin');

function getServiceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;

  // Try normal JSON first
  try { return JSON.parse(raw); } catch (_) {}

  // If someone pasted multiline JSON (with real newlines), fix it
  try {
    const fixed = raw.replace(/\n/g, '\\n');
    return JSON.parse(fixed);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
    throw e;
  }
}

if (!admin.apps.length) {
  const sa = getServiceAccountFromEnv();

  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  } else {
    // IMPORTANT: do NOT require('../serviceAccountKey.json') on Railway
    throw new Error('Firebase credentials not provided');
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
