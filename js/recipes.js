document.addEventListener('DOMContentLoaded', function() {
    let allRecipes = [];
    let filteredRecipes = [];
    const recipesPerPage = 24;
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
    
    // Функция плавной прокрутки вверх
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Функция для получения параметра категории из URL
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('category');
    }
    
    // Загрузка рецептов
    fetch('recipes.json')
      .then(response => response.json())
      .then(data => {
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];
        
        // Применяем фильтр категории из URL, если он есть
        const urlCategory = getCategoryFromURL();
        if (urlCategory) {
            const options = categoryFilter.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value.toLowerCase() === urlCategory.toLowerCase()) {
                    categoryFilter.value = options[i].value;
                    break;
                }
            }
        }
        
        applyFilters();
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
          recipe.category && recipe.category.toLowerCase() === categoryFilter.value.toLowerCase()
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
      scrollToTop(); // Прокрутка вверх после применения фильтров
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
      scrollToTop(); // Прокрутка вверх после сброса фильтров
      
      // Удаляем параметр категории из URL
      const url = new URL(window.location);
      url.searchParams.delete('category');
      window.history.pushState({}, '', url);
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
      
      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'recipes-grid';
      
      recipesToShow.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const cookingTime = recipe.cookingTime || 'Время не указано';
        const calories = recipe.calories ? `${recipe.calories} ккал` : 'Калории не указаны';
        
        const recipeLink = document.createElement('a');
        recipeLink.href = `recipe-details.html?id=${recipe.id}`;
        recipeLink.className = 'recipe-link';
        
        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.title;
        recipeImage.className = 'recipe-image';
        
        const recipeContent = document.createElement('div');
        recipeContent.className = 'recipe-content';
        
        const recipeTitle = document.createElement('h3');
        recipeTitle.className = 'recipe-title';
        recipeTitle.textContent = recipe.title;
        
        const recipeMeta = document.createElement('div');
        recipeMeta.className = 'recipe-meta';
        
        const timeSpan = document.createElement('span');
        timeSpan.textContent = cookingTime;
        
        const caloriesSpan = document.createElement('span');
        caloriesSpan.textContent = calories;
        
        recipeMeta.appendChild(timeSpan);
        recipeMeta.appendChild(caloriesSpan);
        
        recipeContent.appendChild(recipeTitle);
        recipeContent.appendChild(recipeMeta);
        
        if (recipe.diet && recipe.diet.length > 0) {
          const dietTags = document.createElement('div');
          dietTags.className = 'diet-tags';
          
          recipe.diet.forEach(diet => {
            const dietTag = document.createElement('span');
            dietTag.className = 'diet-tag';
            dietTag.textContent = diet;
            dietTags.appendChild(dietTag);
          });
          
          recipeContent.appendChild(dietTags);
        }
        
        recipeLink.appendChild(recipeImage);
        recipeLink.appendChild(recipeContent);
        recipeCard.appendChild(recipeLink);
        cardsGrid.appendChild(recipeCard);
      });
      
      recipesContainer.appendChild(cardsGrid);
    }
    
    // Отрисовка пагинации
    function renderPagination() {
      const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
      paginationContainer.innerHTML = '';
      
      if (totalPages <= 1) return;
      
      // Кнопка "Назад"
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.innerHTML = '&larr;';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderRecipes();
          renderPagination();
          scrollToTop(); // Прокрутка вверх при перелистывании
        }
      });
      paginationContainer.appendChild(prevBtn);
      
      // Нумерация страниц
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'page-btn';
        firstPageBtn.textContent = '1';
        firstPageBtn.addEventListener('click', () => {
          currentPage = 1;
          renderRecipes();
          renderPagination();
          scrollToTop(); // Прокрутка вверх при перелистывании
        });
        paginationContainer.appendChild(firstPageBtn);
        
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          paginationContainer.appendChild(ellipsis);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          renderRecipes();
          renderPagination();
          scrollToTop(); // Прокрутка вверх при перелистывании
        });
        paginationContainer.appendChild(pageBtn);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          paginationContainer.appendChild(ellipsis);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'page-btn';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.addEventListener('click', () => {
          currentPage = totalPages;
          renderRecipes();
          renderPagination();
          scrollToTop(); // Прокрутка вверх при перелистывании
        });
        paginationContainer.appendChild(lastPageBtn);
      }
      
      // Кнопка "Вперед"
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.innerHTML = '&rarr;';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderRecipes();
          renderPagination();
          scrollToTop(); // Прокрутка вверх при перелистывании
        }
      });
      paginationContainer.appendChild(nextBtn);
    }
});