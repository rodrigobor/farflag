// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDKV6g6m_6vA44pMFKz1GhAi2i2Rn_FxdI",
  authDomain: "farflag-fe337.firebaseapp.com",
  projectId: "farflag-fe337",
  storageBucket: "farflag-fe337.firebasestorage.app",
  messagingSenderId: "1006054586756",
  appId: "1:1006054586756:web:9216dd12e6636251ce05d1",
  measurementId: "G-W4HHQNWQK3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
