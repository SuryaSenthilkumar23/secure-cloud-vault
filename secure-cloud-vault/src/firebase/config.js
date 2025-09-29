// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUkc5w5B6q8DViVxCFWktCwJD_eliZzh8",
  authDomain: "digital-vault-67faf.firebaseapp.com",
  projectId: "digital-vault-67faf",
  storageBucket: "digital-vault-67faf.firebasestorage.app",
  messagingSenderId: "217646917496",
  appId: "1:217646917496:web:e32236be120c3248798a8d",
  measurementId: "G-C4S5QCSHXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;