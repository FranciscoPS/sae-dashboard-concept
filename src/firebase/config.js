// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs1fR-NkShibv2FtK2uPSd0sAoMKMr9n8",
  authDomain: "graph-data-d8b84.firebaseapp.com",
  databaseURL: "https://graph-data-d8b84-default-rtdb.firebaseio.com",
  projectId: "graph-data-d8b84",
  storageBucket: "graph-data-d8b84.firebasestorage.app",
  messagingSenderId: "617384651299",
  appId: "1:617384651299:web:8d48eb75c9161371029f96",
  measurementId: "G-380CRMCMZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const collectionName = "carreras";