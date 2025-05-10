document.querySelector('.subscription-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = this.querySelector('.subscription-form__input');
  const email = emailInput.value.trim();
  
  // Простая валидация email
  if (!email || !email.includes('@') || !email.includes('.')) {
    alert('Пожалуйста, введите корректный email адрес');
    return;
  }
  
  // Здесь можно добавить AJAX запрос для отправки данных на сервер
  alert('Спасибо за подписку!');
  emailInput.value = ''; // Очищаем поле после отправки
});