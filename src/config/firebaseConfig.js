// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuQJXpfMafFr7QQFgN72T5SNTKv2cgH24",
  authDomain: "ia-project-e372e.firebaseapp.com",
  projectId: "ia-project-e372e",
  storageBucket: "ia-project-e372e.appspot.com",
  messagingSenderId: "1069178042131",
  appId: "1:1069178042131:web:eef8db033c3c840a488ce6",
  measurementId: "G-MRB09J2KW8",
  databaseURL: "https://ia-project-e372e-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);


const db = getDatabase(app)
export default db