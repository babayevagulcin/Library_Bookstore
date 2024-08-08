let API_URL = `https://www.googleapis.com/books/v1/volumes?q=$%7Binput.value%7D`;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAPlbFpE_A4YAaKRXPKyR6AKmu5B8ef2o",
  authDomain: "librarybookstore-96a11.firebaseapp.com",
  projectId: "librarybookstore-96a11",
  storageBucket: "librarybookstore-96a11.appspot.com",
  messagingSenderId: "841489569339",
  appId: "1:841489569339:web:f8cb005479af3652a36e1e",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
