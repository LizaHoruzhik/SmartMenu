document.querySelector('.subscription-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = this.querySelector('.subscription-form__input');
  const email = emailInput.value.trim();
  
  // Простая валидация email
  if (!email || !email.includes('@') || !email.includes('.')) {
    showNotification('Пожалуйста, введите корректный email адрес', 'error');
    return;
  }
  
  // Создаем уведомление
  showNotification('Спасибо за подписку! На ваш email будут приходить новые рецепты.');
  
  emailInput.value = ''; // Очищаем поле после отправки
});

function showNotification(message, type = 'success') {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `subscription-notification ${type}`;
  
  // Добавляем иконку в зависимости от типа
  const icon = type === 'success' ? '✓' : '⚠️';
  notification.innerHTML = `
    <span class="subscription-notification__icon">${icon}</span>
    <span class="subscription-notification__text">${message}</span>
    <button class="subscription-notification__close">&times;</button>
  `;
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Показываем уведомление
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Закрытие по кнопке
  notification.querySelector('.subscription-notification__close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Автоматическое закрытие через 5 секунд
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}