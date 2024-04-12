import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/functions"; // Import Firebase Functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // Import for Firebase Functions with Modular SDK
import { getDatabase } from "firebase/database";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSJJKph_ZQc4B1SWIBIE-DjwZxXSQZO94",
  authDomain: "quicktube-b2aa2.firebaseapp.com",
  databaseURL: "https://quicktube-b2aa2-default-rtdb.firebaseio.com",
  projectId: "quicktube-b2aa2",
  storageBucket: "quicktube-b2aa2.appspot.com",
  messagingSenderId: "828313505231",
  appId: "1:828313505231:web:236a13edf73d479501d6ba",
  measurementId: "G-MD3FTKXM05",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Initialize Firebase Functions

const database = getDatabase(app);
const auth = getAuth(app);

export { db, storage, app, functions ,database,auth};