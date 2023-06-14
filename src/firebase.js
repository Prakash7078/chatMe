import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey:"AIzaSyAaCUJPoLltKWf7MU-l6JBP5W6rnssIclQ",
  authDomain: "chatme-7357d.firebaseapp.com",
  projectId: "chatme-7357d",
  storageBucket: "chatme-7357d.appspot.com",
  messagingSenderId: "775344454214",
  appId: "1:775344454214:web:555890dd404a6a4816e847"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage=getStorage(app);
export const db=getFirestore(app);