document.addEventListener('DOMContentLoaded', function() {
    const RECIPES_PER_ROW = {
        desktop: { cards: 8, columns: 4 },
        tablet: { cards: 6, columns: 3 },
        mobile: { cards: 4, columns: 2 }
    };
    
    let allRecipes = [];
    
    // Загрузка рецептов
    function loadRecipes() {
        fetch('recipes.json')
            .then(response => {
                if (!response.ok) throw new Error('Не удалось загрузить рецепты');
                return response.json();
            })
            .then(data => {
                allRecipes = data.recipes || [];
                updateRecipesDisplay();
            })
            .catch(error => {
                console.error('Ошибка загрузки рецептов:', error);
                showErrorMessage();
            });
    }
    
    // Определение типа устройства
    function getDeviceType() {
        const width = window.innerWidth;
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }
    
    // Обновление отображения рецептов
    function updateRecipesDisplay() {
        if (allRecipes.length === 0) {
            showErrorMessage('Нет доступных рецептов');
            return;
        }
        
        const device = getDeviceType();
        const recipesToShow = allRecipes.slice(-RECIPES_PER_ROW[device].cards);
        renderRecipeCards(recipesToShow, RECIPES_PER_ROW[device].columns);
    }
    
    // Отрисовка карточек рецептов
    function renderRecipeCards(recipes, columns) {
        const recipesContainer = document.querySelector('.recipe-cards');
        if (!recipesContainer) return;
        
        recipesContainer.innerHTML = '';
        recipesContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        recipes.forEach(recipe => {
            const recipeCard = createRecipeCard(recipe);
            recipesContainer.appendChild(recipeCard);
        });
    }
    
    // Создание карточки рецепта
    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const imageSrc = recipe.image.startsWith('http') ? 
                        recipe.image : 
                        `img/recipes/${recipe.image}`;
        
        card.innerHTML = `
            <a href="recipe-details.html?id=${recipe.id}" class="recipe-link" aria-label="Рецепт: ${recipe.title}">
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
    
    // Отрисовка тегов диет
    function renderDietTags(diets) {
        if (!diets || !Array.isArray(diets)) return '';
        
        const validDiets = diets
            .filter(diet => diet && typeof diet === 'string')
            .map(diet => diet.trim())
            .filter(diet => diet.length > 0);
        
        if (validDiets.length === 0) return '';
        
        return `
            <div class="diet-tags">
                ${validDiets.map(diet => `<span class="diet-tag">${diet}</span>`).join('')}
            </div>
        `;
    }
    
    // Показ сообщения об ошибке
    function showErrorMessage(message = 'Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.') {
        const container = document.querySelector('.recipe-cards');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="retry-button">Попробовать снова</button>
            </div>
        `;
        
        container.querySelector('.retry-button')?.addEventListener('click', loadRecipes);
    }
    
    // Оптимизация обработки событий ресайза
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Инициализация
    window.addEventListener('resize', debounce(updateRecipesDisplay, 200));
    loadRecipes();
});