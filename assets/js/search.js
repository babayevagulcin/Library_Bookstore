document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("bookSlider");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const slideWidth = slider.querySelector(".book-card").offsetWidth;
  let currentIndex = 0;
  const totalSlides = slider.children.length;

  function updateSlider() {
    const offset = -currentIndex * slideWidth;
    slider.style.transform = `translateX(${offset}px)`;
  }

  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextButton.addEventListener("click", function () {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener("resize", function () {
    slider.style.transition = "none"; // Disable transition during resize
    setTimeout(() => {
      slider.style.transition = "transform 0.5s ease-in-out"; // Re-enable transition after resize
      updateSlider();
    }, 100);
  });

  updateSlider();
});
