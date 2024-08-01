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
