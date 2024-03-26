import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZEwn3r9sG0hXqoIUVH4VxlB4avleOIkY",
  authDomain: "capstoneproject-7cbb3.firebaseapp.com",
  databaseURL:
    "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstoneproject-7cbb3",
  storageBucket: "capstoneproject-7cbb3.appspot.com",
  messagingSenderId: "300399270711",
  appId: "1:300399270711:web:432cacb35d320c905618b2",
  measurementId: "G-GXC761QRB2",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app);

export {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  storage,
  ref,
  listAll,
  getDownloadURL,
};
