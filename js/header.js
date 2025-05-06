// Обновленный JavaScript
// Переключатель темы
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
const html = document.documentElement;

// Проверяем сохраненную тему или системные настройки
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
  html.setAttribute('data-theme', 'dark');
}

// Обработчик клика для всех переключателей темы
themeToggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});

// Бургер-меню
const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

burgerMenu.addEventListener('click', function() {
  this.classList.toggle('open');
  mobileMenu.classList.toggle('active');
  
  // Блокировка прокрутки страницы при открытом меню
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
  if (!e.target.closest('.burger-menu') && !e.target.closest('.mobile-menu')) {
    burgerMenu.classList.remove('open');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});