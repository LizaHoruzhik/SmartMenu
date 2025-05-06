document.addEventListener('DOMContentLoaded', function() {
  // Загрузка рецептов из JSON файла
  fetch('recipes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить рецепты');
      }
      return response.json();
    })
    .then(data => {
      // Получаем 8 последних рецептов
      const lastEightRecipes = data.recipes.slice(-8);
      renderRecipeCards(lastEightRecipes);
    })
    .catch(error => {
      console.error('Ошибка загрузки рецептов:', error);
      showErrorMessage();
    });

  // Функция отрисовки карточек рецептов
  function renderRecipeCards(recipes) {
    const recipesContainer = document.querySelector('.recipe-cards');
    if (!recipesContainer) return;

    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
      const recipeCard = createRecipeCard(recipe);
      recipesContainer.appendChild(recipeCard);
    });
  }

  // Создание HTML-карточки для рецепта
  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    // Проверяем, является ли image URL (начинается с http/https) или локальным путем
    const imageSrc = recipe.image.startsWith('http') ? 
                    recipe.image : 
                    `img/recipes/${recipe.image}`;
    
    card.innerHTML = `
      <a href="recipe-details.html?id=${recipe.id}" class="recipe-link">
        <img src="${imageSrc}" alt="${recipe.title}" class="recipe-image" loading="lazy">
        <div class="recipe-content">
          <h3 class="recipe-title">${recipe.title}</h3>
          <p class="cooking-time">${recipe.cookingTime}</p>
          ${renderDietTags(recipe.diet)}
        </div>
      </a>
    `;
    
    return card;
  }

  // Генерация тегов диет
  function renderDietTags(diets) {
    if (!diets || diets.length === 0) return '';
    return `
      <div class="diet-tags">
        ${diets.map(diet => `<span class="diet-tag">${diet}</span>`).join('')}
      </div>
    `;
  }

  // Показать сообщение об ошибке
  function showErrorMessage() {
    const container = document.querySelector('.recipe-cards');
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-message">
        <p>Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</p>
      </div>
    `;
  }
});