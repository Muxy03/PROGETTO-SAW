import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browser } from "$app/environment";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSLfzRUoVoKO7_ZjIlQLZSS5eEe7STBd0",
  authDomain: "xcode-bf61a.firebaseapp.com",
  projectId: "xcode-bf61a",
  storageBucket: "xcode-bf61a.appspot.com",
  messagingSenderId: "876194418231",
  appId: "1:876194418231:web:1baf604dfde23807ddf9b2",
  measurementId: "G-F1NRN3Y58B"
};

const app = initializeApp(firebaseConfig);

if (browser) {
	getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);