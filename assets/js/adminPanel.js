document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.querySelector(".book__logo_hamburger");
  const responsiveMenu = document.querySelector(".res_header");
  const adminNavbar = document.querySelector(".admin_nav");
  const adminPanel = document.querySelector(".admin_panel");
  const xIcon = document.querySelector(".book__logo .icon-x");
  const body = document.body;

  function resMenuView() {
    if (window.innerWidth <= 767) {
      hamburgerMenu.style.display = "block";
      xIcon.style.display = "none";
      adminNavbar.style.display = "none";
      responsiveMenu.style.display = "flex";
      adminPanel.style.display = "block";
    } else {
      hamburgerMenu.style.display = "none";
      xIcon.style.display = "none";
      adminNavbar.style.display = "block";
      responsiveMenu.style.display = "none";
      adminPanel.style.display = "block";
      body.style.backgroundColor = "var(--background-color-light)";
      adminNavbar.style.backgroundColor = "var(--background-color-red)";
      adminNavbar.classList.remove("res");
    }
  }

  resMenuView();

  window.addEventListener("resize", resMenuView);

  hamburgerMenu.addEventListener("click", function () {
    if (window.innerWidth <= 767) {
      responsiveMenu.style.display = "none";
      adminPanel.style.display = "none";
      adminNavbar.style.display = "block";
      xIcon.style.display = "block";
      adminNavbar.classList.add("res");
      body.style.backgroundColor = "var(--res-admin-bg)";
    }
  });

  xIcon.addEventListener("click", function () {
    if (window.innerWidth <= 767) {
      responsiveMenu.style.display = "flex";
      adminPanel.style.display = "block";
      adminNavbar.style.display = "none";
      adminNavbar.classList.remove("res");
      body.style.backgroundColor = "var(--background-color-light)";
      adminNavbar.style.backgroundColor = "var(--background-color-red)";
    }
  });
});

if (localStorage.getItem("isAdmin") !== "true") {
  window.location.href = "adminLogin.html";
}

//! FIREBASE DATA// adminPanel.js

import { db } from "./firebaseConfig.js";
import {
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

async function fetchAndSaveBooks(query) {
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const data = await response.json();
    const books = data.items;

    if (books) {
      for (const book of books) {
        const bookRef = ref(db, "books/" + book.id);
        await set(bookRef, book);
      }
      console.log("Books saved to Firebase");
    } else {
      console.log("No books found");
    }
  } catch (error) {
    console.error("Error fetching or saving books:", error);
  }
}

async function getBooksFromFirebase() {
  try {
    const booksRef = ref(db, "books/");
    const snapshot = await get(booksRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No books found in Firebase");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving books from Firebase:", error);
  }
}

document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value;
  fetchAndSaveBooks(query);
});

async function fetchBooks(query) {
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const data = await response.json();
    const books = data.items;
    return books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

function displaySearchResults(books) {
  const searchResultsDiv = document.getElementById("searchResults");

  if (books.length > 0) {
    searchResultsDiv.style.display = "block";
    searchResultsDiv.classList.add("active");
    searchResultsDiv.innerHTML = "";

    books.forEach((book) => {
      const bookTitle = book.volumeInfo.title;
      const bookAuthor = book.volumeInfo.authors
        ? book.volumeInfo.authors.join(", ")
        : "Unknown Author";
      const bookElement = document.createElement("p");

      bookElement.innerHTML = `
        <span class="master icon-clock"></span>
        <span>${bookTitle} by ${bookAuthor}</span>
      `;

      bookElement.addEventListener("click", () => {
        fillBookForm(book);
      });

      searchResultsDiv.appendChild(bookElement);
    });
  } else {
    searchResultsDiv.style.display = "none";
    searchResultsDiv.classList.remove("active");
  }
}

function fillBookForm(book) {
  const volumeInfo = book.volumeInfo;

  document.getElementById("bookName").value = volumeInfo.title || "";
  document.getElementById("authorName").value = volumeInfo.authors
    ? volumeInfo.authors.join(", ")
    : "Unknown Author";
  document.getElementById("imgUrl").value = volumeInfo.imageLinks
    ? volumeInfo.imageLinks.thumbnail
    : "";
  document.getElementById("description").value = volumeInfo.description || "";

  document.getElementById("bookType").value = "fantastic";

  document.getElementById("newBook").checked = false;
}

document.getElementById("searchInput").addEventListener("input", async () => {
  const query = document.getElementById("searchInput").value;
  if (query.length > 2) {
    const books = await fetchBooks(query);
    displaySearchResults(books);
  } else {
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("searchResults").classList.remove("active"); // Arka plan rengini kaldır
  }
});
