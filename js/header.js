// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Theme switching
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  }

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

  // Burger Menu Functionality
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burgerMenu && mobileMenu) {
    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('open');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.burger-menu')) {
        burgerMenu.classList.remove('open');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Search Functionality
  let recipes = [];
  
  fetch('recipes.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      recipes = data.recipes;
      initSearch();
    })
    .catch(error => {
      console.error('Error loading recipes:', error);
      showSearchError();
    });

  function initSearch() {
    setupSearchInput(
      document.getElementById('search-input'),
      document.getElementById('search-results')
    );
    setupSearchInput(
      document.getElementById('mobile-search-input'),
      document.getElementById('mobile-search-results')
    );
  }

  function setupSearchInput(inputElement, resultsContainer) {
    if (!inputElement || !resultsContainer) return;

    inputElement.addEventListener('input', function() {
      handleSearch(this.value.trim(), resultsContainer);
    });
    
    inputElement.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        handleSearch(this.value.trim(), resultsContainer);
      }
    });
    
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-container') && 
          !e.target.classList.contains('search-result-item')) {
        resultsContainer.style.display = 'none';
      }
    });
    
    inputElement.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        resultsContainer.style.display = 'none';
      }
    });
  }

  function handleSearch(query, resultsContainer) {
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    
    if (query.length < 2) return;

    const lowerQuery = query.toLowerCase();
    const matchedRecipes = recipes
      .filter(recipe => recipe.title.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        const aPos = a.title.toLowerCase().indexOf(lowerQuery);
        const bPos = b.title.toLowerCase().indexOf(lowerQuery);
        return aPos - bPos;
      })
      .slice(0, 3);

    if (matchedRecipes.length > 0) {
      resultsContainer.innerHTML = matchedRecipes.map(recipe => 
        `<a href="recipe-details.html?id=${recipe.id}" class="search-result-item" data-id="${recipe.id}">
          ${highlightMatch(recipe.title, query)}
        </a>`
      ).join('');
      
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      resultsContainer.style.display = 'block';
    }
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);
    if (startIndex === -1) return text;
    
    const endIndex = startIndex + query.length;
    return [
      text.slice(0, startIndex),
      '<span class="highlight">',
      text.slice(startIndex, endIndex),
      '</span>',
      text.slice(endIndex)
    ].join('');
  }

  function showSearchError() {
    const searchContainers = document.querySelectorAll('.search-container');
    searchContainers.forEach(container => {
      const errorElement = document.createElement('div');
      errorElement.className = 'search-error';
      errorElement.textContent = 'Ошибка загрузки рецептов';
      container.appendChild(errorElement);
    });
  }

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Закрываем мобильное меню, если оно открыто
      const burgerMenu = document.querySelector('.burger-menu');
      if (burgerMenu && burgerMenu.classList.contains('open')) {
        burgerMenu.classList.remove('open');
        document.querySelector('.mobile-menu').classList.remove('active');
      }
    }
  });
});
});