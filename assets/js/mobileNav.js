const hamburger = document.querySelector(".book__hamburger");
const xIcon = document.querySelector(".book__x");
const mobileMenu = document.querySelector("#mobileMenu");

hamburger.addEventListener("click", function () {
  mobileMenu.classList.add("open");
});
xIcon.addEventListener("click", function () {
  mobileMenu.classList.remove("open");
});
window.addEventListener("resize", function () {
  if (window.innerWidth > 767) {
    mobileMenu.classList.remove("open");
  }
});
