// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9-384mfIZvUb6shbYwFqs-JgIloNX8-M",
  authDomain: "meta-view-lite.firebaseapp.com",
  databaseURL: "https://meta-view-lite-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meta-view-lite",
  storageBucket: "meta-view-lite.firebasestorage.app",
  messagingSenderId: "63752467836",
  appId: "1:63752467836:web:4cc1925005a7df7bcea0f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);