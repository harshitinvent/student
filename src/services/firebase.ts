import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

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
export const database = getDatabase(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  try {
    // Uncomment these lines if you want to use Firebase emulators
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectDatabaseEmulator(database, 'localhost', 9000);
  } catch (error) {
    console.log('Firebase emulators already connected or not available');
  }
}

export default app; 