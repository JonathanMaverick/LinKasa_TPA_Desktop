// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOweyPKA44pBJ1MQRWXhmgd6nSsisqc1o",
  authDomain: "vk-tpa-desktop.firebaseapp.com",
  projectId: "vk-tpa-desktop",
  storageBucket: "vk-tpa-desktop.appspot.com",
  messagingSenderId: "517121331888",
  appId: "1:517121331888:web:9a39af5b090e627ad3e175"
};

// LinKasa
// const firebaseConfig = {
//   apiKey: "AIzaSyDHCXeZA4tg--nj8ifqQhlSfONMvauuK9w",
//   authDomain: "link-a6aa4.firebaseapp.com",
//   projectId: "link-a6aa4",
//   storageBucket: "link-a6aa4.appspot.com",
//   messagingSenderId: "723847958536",
//   appId: "1:723847958536:web:d34bb69aa7fb8f012201bd"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
.then(() => {
  // Auth state will persist in local storage
})
.catch((error) => {
  console.error('Error enabling persistence:', error);
});

export const storage = getStorage(app);
