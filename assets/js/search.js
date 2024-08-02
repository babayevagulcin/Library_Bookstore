let currentSlide = 0;

const slides = document.querySelectorAll('.book-card');
const totalSlides = slides.length;

document.querySelector('.next-btn').addEventListener('click', () => {
    changeSlide(1);
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    changeSlide(-1);
});

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    updateSlidePosition();
}

function updateSlidePosition() {
    const slider = document.querySelector('.book-slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}