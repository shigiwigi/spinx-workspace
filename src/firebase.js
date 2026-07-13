// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHBdcGww5YqLq-YN1_8huO2Xj-YHDeUnY",
  authDomain: "spinx-workspace.firebaseapp.com",
  projectId: "spinx-workspace",
  storageBucket: "spinx-workspace.firebasestorage.app",
  messagingSenderId: "68519091540",
  appId: "1:68519091540:web:de145b8f2ed0bc7238fcc1",
  measurementId: "G-V35Y7HF66D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app); // Added the missing auth export
export const googleProvider = new GoogleAuthProvider();