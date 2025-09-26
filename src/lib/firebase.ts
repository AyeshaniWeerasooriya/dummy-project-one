import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKItS9SgkA0qPLWrKWOFKGhaNXWX0-2_M",
  authDomain: "learning-management-syst-49be1.firebaseapp.com",
  projectId: "learning-management-syst-49be1",
  storageBucket: "learning-management-syst-49be1.appspot.com",
  messagingSenderId: "970256693769",
  appId: "1:970256693769:web:7d7820ceec1af70dfb56d8",
  measurementId: "G-ENE9L3EGHD",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics = (async () =>
  (await isSupported()) ? getAnalytics(app) : null)();
