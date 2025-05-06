// Карусель
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let slideInterval;

function updateCarousel() {
  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  // Обновляем индикаторы
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
  
  // Обновляем слайды
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
}

function goToNextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
  resetInterval(); // Сбрасываем интервал при ручном переключении
}

function goToPrevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
  resetInterval(); // Сбрасываем интервал при ручном переключении
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetInterval(); // Сбрасываем интервал при ручном переключении
}

function startInterval() {
  slideInterval = setInterval(goToNextSlide, 3000); // 3 секунды
}

function resetInterval() {
  clearInterval(slideInterval);
  startInterval();
}

// Остановка автоматического перелистывания при наведении
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

carousel.addEventListener('mouseleave', () => {
  startInterval();
});

// Инициализация карусели
document.addEventListener('DOMContentLoaded', () => {
  updateCarousel();
  startInterval(); // Запускаем автоматическую смену слайдов
});