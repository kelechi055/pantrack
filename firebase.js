// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0aDx3LmIE6HRRiw9eKg8z1xV2nHxkdLs",
  authDomain: "pantrack-12913.firebaseapp.com",
  projectId: "pantrack-12913",
  storageBucket: "pantrack-12913.appspot.com",
  messagingSenderId: "34467040828",
  appId: "1:34467040828:web:19fe0bbdb8b5d8e3ebbd39",
  measurementId: "G-YD1P0XSHXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}