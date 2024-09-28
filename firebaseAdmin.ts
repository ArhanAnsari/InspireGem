import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app: App;

// Initialize the Firebase Admin SDK if no other apps are initialized
if (getApps().length === 0) {
  // Parse the service account key from environment variable
  const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

  // Initialize the app with the service account key
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  // Use the existing app instance if already initialized
  app = getApp();
}

// Firestore and Storage instances for admin SDK
const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

// Export the app, Firestore, and Storage instances
export { app as adminApp, adminDb, adminStorage };
