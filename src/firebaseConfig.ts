import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyD22NOrzP66PcSiSwU8YHIdjjpIm5fW05k",
  authDomain: "taskmanagerapp-b99dd.firebaseapp.com",
  projectId: "taskmanagerapp-b99dd",
  storageBucket: "taskmanagerapp-b99dd.appspot.com",
  messagingSenderId: "452274017932",
  appId: "1:452274017932:web:bbaeed2afb67dae07a4da9",
  measurementId: "G-8BEKVC5PD6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
