import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzjefHHmkLhC-qvd-ikSodWWRx2QHQLKg",
  authDomain: "miproyecto-d157b.firebaseapp.com",
  projectId: "miproyecto-d157b",
  storageBucket: "miproyecto-d157b.appspot.com",
  messagingSenderId: "510856880730",
  appId: "1:510856880730:web:3b84cf279f835573196e63",
};

const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

//todos los metodos se hacen en mi aplicación de firebase
const auth = getAuth(app);
const auth2 = getAuth(secondaryApp);

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, auth2, storage, app };
