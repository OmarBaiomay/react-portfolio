import admin from 'firebase-admin';

let initialized = false;

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_KEY;
  if (!raw) return null;

  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    console.error('[firebase] Failed to parse service account JSON:', err.message);
    return null;
  }
}

export function initFirebase() {
  if (initialized) return admin;

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    console.warn('[firebase] No FIREBASE_SERVICE_ACCOUNT_JSON set — push notifications disabled');
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  initialized = true;
  console.log('[firebase] Admin SDK initialized');
  return admin;
}

export function getFirebaseAdmin() {
  if (!initialized) {
    return initFirebase();
  }
  return admin;
}

export default admin;
