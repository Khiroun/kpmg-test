// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkVED4y4Z71eb_BNOusp-LzLTfS_ymBrc",
  authDomain: "kpmgtest-61b3a.firebaseapp.com",
  projectId: "kpmgtest-61b3a",
  storageBucket: "kpmgtest-61b3a.appspot.com",
  messagingSenderId: "525570186307",
  appId: "1:525570186307:web:6d6487feac1a56ec1b88f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

export const addTicket = (ticket) => {
  return addDoc(collection(db, "tickets"), ticket);
};

export const getTickets = async () => {
  const querySnapshot = await getDocs(collection(db, "tickets"));
  const res = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    res.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return res;
};

export const uploadFile = async (name, file) => {
  const storageRef = ref(storage, name);

  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export const updateTask = (id, data) => {
  const taskRef = doc(db, "tickets", id);
  updateDoc(taskRef, data);
};
