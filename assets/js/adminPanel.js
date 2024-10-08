window.addEventListener("load", function () {
  const isAdmin = sessionStorage.getItem("isAdmin");
  if (isAdmin !== "true") {
    window.location.href = "adminLogin.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  //* MOBILE MENU
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

//! FIREBASE DATA

import { db } from "./firebaseConfig.js";
import {
  ref,
  set,
  get,
  push,
  query,
  orderByChild,
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
        const bookRef = ref(db, `books/${book.id}`);
        const snapshot = await get(bookRef);
        if (!snapshot.exists()) {
          await set(bookRef, book);
        }
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
      const books = snapshot.val();
      const booksArray = Object.keys(books).map((key) => ({
        ...books[key],
        id: key,
      }));
      return booksArray.reverse();
    } else {
      console.log("No books found in Firebase");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving books from Firebase:", error);
  }
}
//! SEARCH BOOKS
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

  document.getElementById("bookName").value =
    volumeInfo.title || "Unknown Title";
  document.getElementById("authorName").value = volumeInfo.authors
    ? volumeInfo.authors.join(", ")
    : "Unknown Author";
  document.getElementById("imgUrl").value = volumeInfo.imageLinks
    ? volumeInfo.imageLinks.thumbnail
    : "";
  document.getElementById("description").value =
    volumeInfo.description || "No description available";

  const categories = volumeInfo.categories || [];
  const bookTypeSelect = document.getElementById("bookType");
  bookTypeSelect.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.toLowerCase().replace(/\s+/g, "-");
    option.textContent = category;
    bookTypeSelect.appendChild(option);
  });

  if (categories.length === 0) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "unknown";
    defaultOption.textContent = "Unknown";
    bookTypeSelect.appendChild(defaultOption);
  }
  document.getElementById("newBook").checked = false;
}

document.getElementById("searchInput").addEventListener("input", async () => {
  const query = document.getElementById("searchInput").value;
  if (query.length > 2) {
    const books = await fetchBooks(query);
    displaySearchResults(books);
  } else {
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("searchResults").classList.remove("active");
  }
});

async function updateTimestamps() {
  const booksRef = ref(db, "books");
  const booksQuery = query(booksRef, orderByKey());
  const snapshot = await get(booksQuery);

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const bookKey = childSnapshot.key;
      const bookData = childSnapshot.val();

      if (!bookData.timestamp) {
        const updatedBookData = {
          ...bookData,
          timestamp: Date.now(),
        };
        set(ref(db, `books/${bookKey}`), updatedBookData);
      }
    });
    console.log("Timestamps updated for existing books.");
  } else {
    console.log("No books found in the database.");
  }
}

//! KİTAB elave etmek
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("bookForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const newBook = getFormData();
      if (!newBook) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const dbRef = ref(db, "books");
        const newBookRef = ref(db, `books/${push(dbRef).key}`);
        await set(newBookRef, {
          ...newBook,
          timestamp: Date.now(),
        });
        const booksQuery = query(ref(db, "books"), orderByChild("timestamp"));

        if (newBook.new) {
          const newBooksRef = ref(db, `newBooks/${push(dbRef).key}`);
          await set(newBooksRef, newBook);
        }

        console.log("Book added to Firebase");

        addBookToCatalog(newBook, newBookRef.key);
        resetForm();
      } catch (error) {
        console.error("Error adding book to Firebase:", error);
      }
    });
});

//! Formdan Datalari cekmek
function getFormData() {
  const bookName = document.getElementById("bookName").value.trim();
  const authorName = document.getElementById("authorName").value.trim();
  const imgUrl = document.getElementById("imgUrl").value.trim();
  const isNew = document.getElementById("newBook").checked;
  const description = document.getElementById("description").value.trim();
  const bookType = document.getElementById("bookType").value.trim();

  if (!bookName || !authorName || !imgUrl || !description || !bookType) {
    return null;
  }

  return {
    title: bookName || "Unknown Title",
    authors: [authorName || "Unknown Author"],
    imageUrl: imgUrl,
    new: isNew || false,
    description: description || "No description available",
    type: bookType || "Unknown Type",
  };
}

//! FORMU TEMIZLE
function resetForm() {
  document.getElementById("bookForm").reset();
  document.getElementById("bookType").value = "";
}
//! Var olan kitabi yoxlamaq
function bookExists(books, newBook) {
  return Object.values(books).some(
    (book) =>
      book.title === newBook.title &&
      book.authors.includes(newBook.authors[0]) &&
      book.imageUrl === newBook.imageUrl &&
      book.description === newBook.description &&
      book.type === newBook.type &&
      book.new === newBook.new
  );
}
//! Kitablari kataloqa add et
function addBookToCatalog(book, bookId) {
  const catalog = document.getElementById("books-container");

  if (!catalog) {
    console.error("Catalog element not found");
    return;
  }
  const existingBook = catalog.querySelector(`[data-id="${bookId}"]`);
  if (existingBook) {
    return;
  }

  const bookCard = document.createElement("div");
  bookCard.className = "med-product-card";
  bookCard.setAttribute("data-id", bookId);

  bookCard.innerHTML = `
      ${book.new ? ' <div class="new-label">New</div>' : ""}
      <div class="related-prod-wrapper">
        <img src="${book.imageUrl}" alt="${
    book.title
  }" class="related-prod-img" />
      </div>
      <div class="related-prod-detail">
        <h4 class="rel-med-name">${book.title}</h4>
        <span class="rel-no-of-tab">${book.authors.join(", ")}</span>
        <button type="button">Read more</button>
      </div>
    `;

  catalog.appendChild(bookCard);
}
//! ABOUT STORE
document
  .getElementById("aboutForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("aboutBookName").value;
    const imgUrl = document.getElementById("aboutImgUrl").value;
    const description = document.getElementById("aboutDescription").value;

    console.log("Title:", title);
    console.log("Image URL:", imgUrl);
    console.log("Description:", description);

    localStorage.setItem("aboutTitle", title);
    localStorage.setItem("aboutImgUrl", imgUrl);
    localStorage.setItem("aboutDescription", description);

    alert("About info added successfully!");
  });

//! JOIN US
document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const tableBody = document.querySelector(
    "#joinUsSection .join_us__table tbody"
  );

  function renderTable() {
    if (users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center;">No records found.</td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = users
        .map(
          (user, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="master icon-trash" data-index="${index}"></span></td>
          </tr>
        `
        )
        .join("");
    }
  }

  renderTable();

  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("icon-trash")) {
      const index = event.target.getAttribute("data-index");
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderTable();
    }
  });
});

//! CONTACT
document.addEventListener("DOMContentLoaded", function () {
  const contactTableBody = document.querySelector(".contactTable tbody");

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  if (contacts.length > 0) {
    let tableContent = "";

    contacts.forEach((contact, index) => {
      tableContent += `
              <tr>
                  <td>${index + 1}</td>
                  <td>${contact.fullname}</td>
                  <td>${contact.address}</td>
                  <td>${contact.email}</td>
                  <td>${contact.phone}</td>
                  <td><span class="master icon-trash" data-index="${index}"></span></td>
              </tr>
          `;
    });

    contactTableBody.innerHTML = tableContent;

    document.querySelectorAll(".icon-trash").forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        contacts.splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        location.reload();
      });
    });
  } else {
    contactTableBody.innerHTML =
      '<tr><td colspan="6">No contacts found.</td></tr>';
  }
});
