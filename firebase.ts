// firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD-LqVlTQv5nJpB5yDuTHKM-DtOyHPYP1U",
    authDomain: "speed-energy-6a71f.firebaseapp.com",
    projectId: "speed-energy-6a71f",
    storageBucket: "speed-energy-6a71f.firebasestorage.app",
    messagingSenderId: "720761497841",
    appId: "1:720761497841:web:a74a693c9ec7bb63bf6150",
    measurementId: "G-73NL9H8847"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);


export { database, ref, onValue, app, db};
