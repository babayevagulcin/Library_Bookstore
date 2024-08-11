const joinUsBtn = document.querySelector(".book__join");
const joinModal = document.querySelector(".join_modal");

joinUsBtn.addEventListener("click", () => {
  joinModal.style.display = "flex";
});

joinModal.addEventListener("click", (event) => {
  if (event.target === joinModal) {
    joinModal.style.display = "none";
  }
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("emailInput").value;
    if (!fullName || !email) {
      alert("Please fill in all fields.");
      return;
    }

    const userData = {
      fullName: fullName,
      email: email,
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(userData);

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("loginForm").reset();
  });
