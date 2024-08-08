import { db } from "./firebaseConfig.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

async function login(username, password) {
  try {
    const adminRef = ref(db, "admin");
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
      const adminData = snapshot.val();
      if (
        adminData.adminName === username &&
        adminData.adminPassword === password
      ) {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "adminPanel.html";
        return;
      }
    }

    alert("Invalid username or password");
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again.");
  }
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password);
  });
