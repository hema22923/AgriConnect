// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// This is now hardcoded to ensure it loads correctly in your local environment.
const firebaseConfig = {
  apiKey: "AIzaSyBYaYhnb6gpEnF-DJ6u2wEA_iIe9JXcYCU",
  authDomain: "agriconnect-eumdr.firebaseapp.com",
  projectId: "agriconnect-eumdr",
  storageBucket: "agriconnect-eumdr.firebasestorage.app",
  messagingSenderId: "1023481600775",
  appId: "1:1023481600775:web:f622460e455fdeb3fb03a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
