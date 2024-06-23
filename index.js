const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const categoriesContainer = document.getElementById('categories');
const resultsTitle = document.getElementById('results-title');
const mealResult = document.getElementById('meal-result');
const backBtn = document.getElementById('back-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
  document.querySelector('.meal-details').classList.remove('showRecipe');
});
backBtn.addEventListener('click', () => {
  window.location.reload();
});

// Fetch meal categories
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(response => response.json())
  .then(data => displayCategories(data.categories));

// Function to show loader
function showLoader(loaderId) {
  document.getElementById(loaderId).style.display = 'flex';
}

// Function to hide loader
function hideLoader(loaderId) {
  document.getElementById(loaderId).style.display = 'none';
}

// Fetch meal list that matches the ingredient
function getMealList() {
  const searchInputTxt = searchInput.value.trim();
  if (searchInputTxt.length > 0) {
    categoriesContainer.classList.add('hide'); // Hide categories when search is performed
    mealResult.classList.remove('hide'); // Show search results section
    showLoader('loader');
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
      .then(response => response.json())
      .then(data => {
        hideLoader('loader');
        let html = '';
        if (data.meals) {
          data.meals.forEach(meal => {
            html += `
              <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                  <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                  <h3>${meal.strMeal}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
              </div>
            `;
          });
          mealList.classList.remove('notFound');
        } else {
          html = "Sorry, we didn't find any meal!";
          mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
      })
      .catch(() => hideLoader('loader'));
  }
}

// Fetch meal recipe details
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe-btn')) {
    let mealItem = e.target.parentElement.parentElement;
    showLoader('loader-modal');
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => {
        hideLoader('loader-modal');
        mealRecipeModal(data.meals);
      })
      .catch(() => hideLoader('loader-modal'));
  }
}

// Display meal recipe details in a modal
function mealRecipeModal(meal) {
  meal = meal[0];
  let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="food">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  document.querySelector('.meal-details').classList.add('showRecipe');
}

// Display categories
function displayCategories(categories) {
  let html = '';
  categories.forEach(category => {
    html += `
      <div class="card category-item" data-category="${category.strCategory}">
        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
        <div class="card__content">
          <h3 class="card__title">${category.strCategory}</h3>
          <p class="card__description">${category.strCategoryDescription}</p>
        </div>
      </div>
    `;
  });
  categoriesContainer.innerHTML = html;

  // Add event listeners to category items
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      fetchMealsByCategory(item.dataset.category);
    });
  });
}

// Fetch meals by category
function fetchMealsByCategory(category) {
  categoriesContainer.classList.add('hide'); // Hide categories when a category is selected
  mealResult.classList.remove('hide'); // Show search results section
  showLoader('loader');
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(response => response.json())
    .then(data => {
      hideLoader('loader');
      let html = '';
      data.meals.forEach(meal => {
        html += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
          </div>
        `;
      });
      mealList.innerHTML = html;
      mealList.classList.remove('notFound');
    })
    .catch(() => hideLoader('loader'));
}
