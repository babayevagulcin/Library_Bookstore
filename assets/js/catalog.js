import { db } from "./firebaseConfig.js";
import {
  ref,
  get,
  onChildAdded,
  push,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

function truncateText(text, maxLength) {
  if (!text) {
    return "";
  }
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

document.addEventListener("DOMContentLoaded", function () {
  const booksContainer = document.getElementById("books-container");

  function createBookCard(book) {
    const title = truncateText(book.title || book.name, 15);
    const authorsArray = Array.isArray(book.authors)
      ? book.authors
      : [book.authors || "Unknown Author"];
    const authorsString = authorsArray.join(", ");
    const author = truncateText(authorsString, 15);
    const displayImageUrl = book.imageUrl ? book.imageUrl : "../img/book_1.png";

    return `
      <div class="med-product-card" data-id="${book.id}">
        ${book.new ? ' <div class="new-label">New</div>' : ""}
        <div class="related-prod-wrapper">
          <img src="${displayImageUrl}" alt="${title}" class="related-prod-img" />
        </div>
        <div class="related-prod-detail">
          <h4 class="rel-med-name">${title}</h4>
          <span class="rel-no-of-tab">${author}</span>
          <button type="button">Read more</button>
        </div>
      </div>
    `;
  }
  function addBookToCatalog(book) {
    const bookCardHTML = createBookCard(book);
    booksContainer.insertAdjacentHTML("afterbegin", bookCardHTML);
  }

  async function loadBooks() {
    const booksRef = ref(db, "books/");
    try {
      const snapshot = await get(booksRef);
      if (snapshot.exists()) {
        const books = [];
        snapshot.forEach((childSnapshot) => {
          const book = childSnapshot.val();
          books.push({ ...book, id: childSnapshot.key });
        });
        books.sort((a, b) => b.timestamp - a.timestamp);
        books.forEach((book) => {
          addBookToCatalog(book);
        });

        books.reverse().forEach((book) => {
          addBookToCatalog(book);
        });
      }
    } catch (error) {
      console.error("Error loading books:", error);
    }

    onChildAdded(booksRef, (snapshot) => {
      const book = snapshot.val();
      addBookToCatalog({ ...book, id: snapshot.key });
    });
  }

  loadBooks();
});

//! NEW BOOKS COLLECTION
function displayNewBooks() {
  const newBooksRef = ref(db, "newBooks");

  onValue(newBooksRef, (snapshot) => {
    const newBooksContainer = document.querySelector(".new_book");
    newBooksContainer.innerHTML = "";

    const newBooks = [];
    snapshot.forEach((childSnapshot) => {
      const book = childSnapshot.val();
      newBooks.push({ ...book, id: childSnapshot.key });
    });
    newBooks.sort((a, b) => b.timestamp - a.timestamp);

    newBooks.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "med-product-card";

      const title = truncateText(book.title, 15);
      const authors = truncateText(book.authors.join(", "), 15);

      bookCard.innerHTML = `
        <div class="new-label">New</div>
        <div class="related-prod-wrapper">
          <img src="${book.imageUrl}" alt="${book.title}" class="related-prod-img" />
        </div>
        <div class="related-prod-detail">
          <h4 class="rel-med-name">${title}</h4>
          <span class="rel-no-of-tab">${authors}</span>
          <button type="button">Read more</button>
        </div>
      `;

      newBooksContainer.prepend(bookCard);
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  displayNewBooks();
});

const bindCarouselEvents = (containerId) => {
  const wrapper = document.getElementById(containerId);
  const btn_left = wrapper.getElementsByClassName("btn-left")[0];
  const btn_right = wrapper.getElementsByClassName("btn-right")[0];
  const content = wrapper.getElementsByClassName("carousel-content")[0];
  const content_scroll_width = content.scrollWidth;
  let content_scoll_left = content.scrollLeft;
  if (btn_right) {
    btn_right.addEventListener("click", () => {
      content_scoll_left += 224;
      if (content_scoll_left >= content_scroll_width) {
        content_scoll_left = content_scroll_width;
      }
      content.scrollLeft = content_scoll_left;
    });
  }
  if (btn_left) {
    btn_left.addEventListener("click", () => {
      content_scoll_left -= 224;
      content.scrollLeft = content_scoll_left;
    });
  }

  // scroll binding
  content.addEventListener("scroll", () => {
    let scrollLeft = Math.ceil(content.scrollLeft);
    let contentScrollWidth = content.scrollWidth;
    let contentWidth = content.clientWidth;
    let rightEdge = contentScrollWidth - contentWidth;
    if (scrollLeft >= rightEdge) {
      btn_right.style.display = "none";
    } else if (scrollLeft < rightEdge) {
      btn_right.style.display = "block";
    }

    if (scrollLeft === 0) {
      btn_left.style.display = "none";
    } else if (scrollLeft > 0) {
      btn_left.style.display = "block";
    }

    content_scoll_left = scrollLeft;
  });
};

window.addEventListener("DOMContentLoaded", function () {
  bindCarouselEvents("med-related-prod-wrapper");
  bindCarouselEvents("med-related-prod-wrapper2");
  bindCarouselEvents("med-related-prod-wrapper3");
});
