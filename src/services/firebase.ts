import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAMoTkY0Vn3lUkkq26bC4RI8dEh6XGX9uA",
  authDomain: "auronedu.firebaseapp.com",
  projectId: "auronedu",
  storageBucket: "auronedu.firebasestorage.app",
  messagingSenderId: "843506301838",
  appId: "1:843506301838:web:4defa525aa7a2201a4c2df",
  measurementId: "G-CRFRWZH35E"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app; 