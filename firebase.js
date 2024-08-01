// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB0aDx3LmIE6HRRiw9eKg8z1xV2nHxkdLs',
  authDomain: 'pantrack-12913.firebaseapp.com',
  projectId: 'pantrack-12913',
  storageBucket: 'pantrack-12913.appspot.com',
  messagingSenderId: '34467040828',
  appId: '1:34467040828:web:19fe0bbdb8b5d8e3ebbd39',
  measurementId: 'G-YD1P0XSHXX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, firestore };
