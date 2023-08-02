import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAN0taW_LWzrdbSBcNl4cUlrsBxTenijHQ",
  authDomain: "rsphcmb-website-ed02a.firebaseapp.com",
  projectId: "rsphcmb-website-ed02a",
  storageBucket: "rsphcmb-website-ed02a.appspot.com",
  messagingSenderId: "339906544214",
  appId: "1:339906544214:web:0bf15218cf72fc320e71f7",
  measurementId: "G-XPT8MT79N7",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
var db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  analytics,
  auth,
  addDoc,
  getDocs,
  collection,
  db,
  ref,
  doc,
  getDoc,
  setDoc,
  storage,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  uploadBytes,
  deleteObject,
  arrayUnion,
  arrayRemove,
  updateEmail,
  setPersistence,
  getDownloadURL,
  updatePassword,
  sendPasswordResetEmail,
  uploadBytesResumable,
  browserSessionPersistence,
};
