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
async function fetchAndStoreBooks(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    const data = await response.json();

    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((book) => {
        const bookId = book.id;
        const bookRef = ref(db, `books/${bookId}`);

        const title = book.volumeInfo.title || "";
        const authors = Array.isArray(book.volumeInfo.authors)
          ? book.volumeInfo.authors
          : [];
        const description = book.volumeInfo.description || "No Description";
        const imageUrl = book.volumeInfo.imageLinks
          ? book.volumeInfo.imageLinks.thumbnail
          : "";

        set(bookRef, {
          title: title,
          authors: authors,
          description: description,
          imageUrl: imageUrl,
        }).catch((error) => {
          console.error(`Error writing book ${bookId}: `, error);
        });
      });
    } else {
      console.log("No books found or data.items is not an array.");
    }
  } catch (error) {
    console.error("Error fetching or writing data: ", error);
  }
}

fetchAndStoreBooks();
export { db };
