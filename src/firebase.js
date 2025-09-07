import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTCTZgk0RWwAKO9lDMWlhUrpahrzXchLA",
  authDomain: "tacosguau-611e6.firebaseapp.com",
  projectId: "tacosguau-611e6",
  storageBucket: "tacosguau-611e6.firebasestorage.app",
  messagingSenderId: "718304507645",
  appId: "1:718304507645:web:0c08aa30ec6bfc84607094",
  measurementId: "G-P3M2ECL8NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
