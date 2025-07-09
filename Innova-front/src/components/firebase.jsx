// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0SbvojdjsWCupHe48iSnf_up7Bgi2x5w",
  authDomain: "filrouge-f4ded.firebaseapp.com",
  projectId: "filrouge-f4ded",
  storageBucket: "filrouge-f4ded.firebasestorage.app",
  messagingSenderId: "164851905557",
  appId: "1:164851905557:web:5d1e2b61516c863ec54a1c",
  measurementId: "G-2YBYSKK2JE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);