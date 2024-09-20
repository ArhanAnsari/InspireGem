// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeDw9XuqmaMer6B7URujXFNZ5Af2BbA5k",
  authDomain: "inspiregem-a6e2e.firebaseapp.com",
  projectId: "inspiregem-a6e2e",
  storageBucket: "inspiregem-a6e2e.appspot.com",
  messagingSenderId: "64551458816",
  appId: "1:64551458816:web:fc32fc26d88102c118e0e5",
  measurementId: "G-PTJXZLHGMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
