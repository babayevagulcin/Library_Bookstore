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
