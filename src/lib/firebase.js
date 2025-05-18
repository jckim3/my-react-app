// src/lib/firebaseInit.js
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBvjAONdtl-yKLbwxT_pKVjUv4wuBmKOKE",
  authDomain: "my-react-app-b4cef.firebaseapp.com",
  projectId: "my-react-app-b4cef",
  storageBucket: "my-react-app-b4cef.appspot.com",
  messagingSenderId: "1927990902",
  appId: "1:1927990902:web:ecc14b7e03ff2236fe1957",
  measurementId: "G-XRN0J5FPMK"
};

let appInstance;

export function connectFirebase() {
  if (!getApps().length) {
    appInstance = initializeApp(firebaseConfig);
    console.log("✅ Firebase 연결됨:", appInstance.name);
  } else {
    console.log("ℹ️ 이미 연결되어 있음:", getApps()[0].name);
  }
}
