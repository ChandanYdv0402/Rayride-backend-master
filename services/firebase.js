// services/firebase.js
const admin = require('firebase-admin');

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;

  // Try plain JSON
  try { return JSON.parse(raw); } catch (_) {}

  // If someone pasted with real newlines, fix them
  try { return JSON.parse(raw.replace(/\n/g, '\\n')); } catch (e) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON'); throw e;
  }
}

if (!admin.apps.length) {
  const sa = readServiceAccount();

  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  } else {
    throw new Error('Firebase credentials not provided');
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
