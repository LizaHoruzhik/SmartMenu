document.addEventListener('DOMContentLoaded', function() {
    // Получаем ID рецепта из URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    // Элементы DOM
    const recipeTitle = document.getElementById('recipe-title');
    const recipeDescription = document.getElementById('recipe-description');
    const recipeImage = document.getElementById('recipe-image');
    const cookingTime = document.getElementById('cooking-time');
    const servingsCount = document.getElementById('servings-count');
    const recipeCategory = document.getElementById('recipe-category');
    const dietTagsContainer = document.getElementById('diet-tags');
    const ingredientsList = document.getElementById('ingredients-list');
    const instructionsList = document.getElementById('instructions-list');
    const calories = document.getElementById('calories');
    const protein = document.getElementById('protein');
    const fat = document.getElementById('fat');
    const carbs = document.getElementById('carbs');
    const decreaseBtn = document.getElementById('decrease-serving');
    const increaseBtn = document.getElementById('increase-serving');
    
    let currentRecipe = null;
    let currentServings = 1;
    
    // Загрузка рецепта
    fetch('recipes.json')
      .then(response => response.json())
      .then(data => {
        const recipe = data.recipes.find(r => r.id === recipeId);
        if (recipe) {
          currentRecipe = recipe;
          currentServings = recipe.servings || 1;
          displayRecipe();
        } else {
          showError('Рецепт не найден');
        }
      })
      .catch(error => {
        console.error('Error loading recipe:', error);
        showError('Не удалось загрузить рецепт');
      });
    
    // Отображение рецепта
    function displayRecipe() {
      recipeTitle.textContent = currentRecipe.title;
      recipeDescription.textContent = currentRecipe.description || '';
      recipeImage.src = currentRecipe.image;
      recipeImage.alt = currentRecipe.title;
      cookingTime.textContent = currentRecipe.cookingTime;
      servingsCount.textContent = currentServings;
      recipeCategory.textContent = currentRecipe.category;
      
      // КБЖУ
      calories.textContent = currentRecipe.calories;
      protein.textContent = currentRecipe.protein;
      fat.textContent = currentRecipe.fat;
      carbs.textContent = currentRecipe.carbs;
      
      // Диеты
      dietTagsContainer.innerHTML = '';
      if (currentRecipe.diet && currentRecipe.diet.length > 0) {
        currentRecipe.diet.forEach(diet => {
          const tag = document.createElement('span');
          tag.className = 'diet-tag';
          tag.textContent = diet;
          dietTagsContainer.appendChild(tag);
        });
      }
      
      // Ингредиенты
      renderIngredients();
      
      // Инструкции
      instructionsList.innerHTML = '';
      currentRecipe.steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = 'instruction-step';
        li.textContent = step;
        instructionsList.appendChild(li);
      });
    }
    
    // Отрисовка ингредиентов с учетом порций
    function renderIngredients() {
      ingredientsList.innerHTML = '';
      
      const servingRatio = currentServings / (currentRecipe.servings || 1);
      
      currentRecipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'ingredient-name';
        nameSpan.textContent = ingredient.name;
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'ingredient-amount';
        
        // Вычисляем количество с учетом порций
        let amount = ingredient.amount * servingRatio;
        
        // Форматируем вывод в зависимости от типа ингредиента
        if (ingredient.unit === 'шт' || ingredient.unit === 'зубч' || ingredient.unit === 'ломт') {
          // Для целых штук округляем до 0.5
          if (amount % 1 > 0.75) {
            amount = Math.ceil(amount);
          } else if (amount % 1 > 0.25) {
            amount = Math.floor(amount) + 0.5;
          } else {
            amount = Math.floor(amount);
          }
          
          // Убираем .0 для целых чисел
          amountSpan.textContent = amount % 1 === 0 ? amount : amount.toFixed(1);
        } else {
          // Для веса/объема округляем до 1 знака
          amountSpan.textContent = amount.toFixed(1);
        }
        
        amountSpan.textContent += ` ${ingredient.unit}`;
        
        li.appendChild(nameSpan);
        li.appendChild(amountSpan);
        ingredientsList.appendChild(li);
      });
    }
    
    // Обработчики изменения порций
    decreaseBtn.addEventListener('click', () => {
      if (currentServings > 0.5) {
        currentServings -= 0.5;
        servingsCount.textContent = currentServings % 1 === 0 ? currentServings : currentServings.toFixed(1);
        renderIngredients();
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      currentServings += 0.5;
      servingsCount.textContent = currentServings % 1 === 0 ? currentServings : currentServings.toFixed(1);
      renderIngredients();
    });
    
    // Показать ошибку
    function showError(message) {
      const main = document.querySelector('main');
      main.innerHTML = `<div class="error-message">${message}</div>`;
    }
  });