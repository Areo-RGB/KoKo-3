// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBNJ7J8e4znajIzyRcqrk32Hxy8uHz0eY",
  authDomain: "tool-c6a2b.firebaseapp.com",
  projectId: "tool-c6a2b",
  storageBucket: "tool-c6a2b.firebasestorage.app",
  messagingSenderId: "127526826081",
  appId: "1:127526826081:web:8b8178a6d415b83777fa20",
  measurementId: "G-VV4KCRRSR7",
  databaseURL: "https://tool-c6a2b-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, analytics };