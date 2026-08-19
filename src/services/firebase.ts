import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVloKkvWaqo8OxpIb9bnh_iwbrv5gnIDE",
  authDomain: "galamsey-reporter-22e38.firebaseapp.com",
  projectId: "galamsey-reporter-22e38",
  storageBucket: "galamsey-reporter-22e38.firebasestorage.app",
  messagingSenderId: "880588545960",
  appId: "1:880588545960:web:5f8ee17d9b9a35446f879d",
  measurementId: "G-B8GZ8GR6BH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);