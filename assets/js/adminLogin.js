import { database, ref, get } from "./firebaseConfig.js";

async function login(username, password) {
  try {
    const adminRef = ref(database, "admin");
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

    alert("Geçersiz kullanıcı adı veya şifre");
  } catch (error) {
    console.error("Giriş hatası:", error);
    alert("Bir hata oluştu. Lütfen tekrar deneyin.");
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
