// src/lib/firebase.js

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // ✅ 추가

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
let dbInstance;
let authInstance;

export function connectFirebase() {
  if (!getApps().length) {
    appInstance = initializeApp(firebaseConfig);
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance); // ✅ Auth 초기화
    console.log("✅ Firebase 연결됨:", appInstance.name);
  } else {
    appInstance = getApps()[0];
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    console.log("ℹ️ 이미 연결되어 있음:", appInstance.name);
  }
}

export function getDb() {
  if (!dbInstance) {
    throw new Error("❌ Firestore가 아직 초기화되지 않았습니다. 먼저 connectFirebase()를 호출하세요.");
  }
  return dbInstance;
}

export function getAuthInstance() {
  if (!authInstance) throw new Error("❌ Auth 초기화 안됨. connectFirebase 먼저 호출하세요.");
  return authInstance;
}