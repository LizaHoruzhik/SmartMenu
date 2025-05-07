document.addEventListener('DOMContentLoaded', function() {
    let allRecipes = [];
    let filteredRecipes = [];
    const recipesPerPage = 20;
    let currentPage = 1;
    
    // DOM элементы
    const recipesContainer = document.getElementById('recipes-container');
    const paginationContainer = document.getElementById('pagination');
    const categoryFilter = document.getElementById('category-filter');
    const timeFilter = document.getElementById('time-filter');
    const dietFilter = document.getElementById('diet-filter');
    const caloriesFilter = document.getElementById('calories-filter');
    const sortBy = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    // Загрузка рецептов
    fetch('recipes.json')
      .then(response => response.json())
      .then(data => {
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];
        renderRecipes();
        renderPagination();
      })
      .catch(error => {
        console.error('Error loading recipes:', error);
        recipesContainer.innerHTML = '<p>Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</p>';
      });
    
    // Обработчики событий для фильтров
    categoryFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('change', applyFilters);
    dietFilter.addEventListener('change', applyFilters);
    caloriesFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Применение фильтров
    function applyFilters() {
      filteredRecipes = [...allRecipes];
      
      // Фильтрация по категории
      if (categoryFilter.value) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.category.toLowerCase() === categoryFilter.value
        );
      }
      
      // Фильтрация по времени приготовления
      if (timeFilter.value) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          const time = parseInt(recipe.cookingTime);
          if (isNaN(time)) return true;
          
          if (timeFilter.value === 'fast') return time <= 15;
          if (timeFilter.value === 'medium') return time > 15 && time <= 30;
          if (timeFilter.value === 'slow') return time > 30;
          return true;
        });
      }
      
      // Фильтрация по диете
      if (dietFilter.value) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.diet && recipe.diet.includes(dietFilter.value)
        );
      }
      
      // Фильтрация по калорийности
      if (caloriesFilter.value) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          if (caloriesFilter.value === 'low') return recipe.calories <= 200;
          if (caloriesFilter.value === 'medium') return recipe.calories > 200 && recipe.calories <= 400;
          if (caloriesFilter.value === 'high') return recipe.calories > 400;
          return true;
        });
      }
      
      // Сортировка
      if (sortBy.value !== 'default') {
        const [field, order] = sortBy.value.split('-');
        
        filteredRecipes.sort((a, b) => {
          if (field === 'calories') {
            return order === 'asc' ? a.calories - b.calories : b.calories - a.calories;
          } else if (field === 'time') {
            const timeA = parseInt(a.cookingTime) || 0;
            const timeB = parseInt(b.cookingTime) || 0;
            return order === 'asc' ? timeA - timeB : timeB - timeA;
          }
          return 0;
        });
      }
      
      currentPage = 1;
      renderRecipes();
      renderPagination();
    }
    
    // Сброс фильтров
    function resetFilters() {
      categoryFilter.value = '';
      timeFilter.value = '';
      dietFilter.value = '';
      caloriesFilter.value = '';
      sortBy.value = 'default';
      filteredRecipes = [...allRecipes];
      currentPage = 1;
      renderRecipes();
      renderPagination();
    }
    
    // Отрисовка рецептов
    function renderRecipes() {
      const start = (currentPage - 1) * recipesPerPage;
      const end = start + recipesPerPage;
      const recipesToShow = filteredRecipes.slice(start, end);
      
      recipesContainer.innerHTML = '';
      
      if (recipesToShow.length === 0) {
        recipesContainer.innerHTML = '<p>Рецепты не найдены. Попробуйте изменить параметры фильтрации.</p>';
        return;
      }
      
      recipesToShow.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const cookingTime = recipe.cookingTime || 'Время не указано';
        const calories = recipe.calories ? `${recipe.calories} ккал` : 'Калории не указаны';
        
        recipeCard.innerHTML = `
          <a href="recipe-details.html?id=${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-content">
              <h3 class="recipe-title">${recipe.title}</h3>
              <div class="recipe-meta">
                <span>${cookingTime}</span>
                <span>${calories}</span>
              </div>
              ${recipe.diet && recipe.diet.length > 0 ? `
                <div class="recipe-diet">
                  ${recipe.diet.map(diet => `<span class="diet-tag">${diet}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </a>
        `;
        
        recipesContainer.appendChild(recipeCard);
      });
    }
    
    // Отрисовка пагинации
    function renderPagination() {
      const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
      paginationContainer.innerHTML = '';
      
      if (totalPages <= 1) return;
      
      // Кнопка "Назад"
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '←';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderRecipes();
          renderPagination();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      paginationContainer.appendChild(prevBtn);
      
      // Нумерация страниц
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          renderRecipes();
          renderPagination();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(pageBtn);
      }
      
      // Кнопка "Вперед"
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = '→';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderRecipes();
          renderPagination();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      paginationContainer.appendChild(nextBtn);
    }
  });