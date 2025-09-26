import * as admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json"; // Path relative to this file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
