// db.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-LqVlTQv5nJpB5yDuTHKM-DtOyHPYP1U",
  authDomain: "speed-energy-6a71f.firebaseapp.com",
  projectId: "speed-energy-6a71f",
  storageBucket: "speed-energy-6a71f.firebasestorage.app",
  messagingSenderId: "720761497841",
  appId: "1:720761497841:web:a74a693c9ec7bb63bf6150",
  measurementId: "G-73NL9H8847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save user data in Firestore
export const saveUserData = async (user: any) => {
  try {
    console.log("User Data:", user); // Debugging the user object

    const userData = {
      id: user.id,
      name: user.fullName || "No Name Provided",
      email: user.emailAddresses?.[0]?.emailAddress || "No Email Provided",
      profileImage: user.imageUrl || null,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.id), userData);
    console.log("User data saved successfully:", userData);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};