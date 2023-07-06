

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryContainer = document.getElementById('category-container');
const areaContainer = document.getElementById('area-container');
const recipeContainer = document.getElementById('recipe-container');
const randomButton = document.getElementById('random-button');

//Search Button
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;
  if (searchQuery) {
    searchRecipes(searchQuery);
    clearSearchInput(searchInput)
  }
   
});





// SEARCH RECIPES
async function searchRecipes(query) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>No recipes found.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


//Display Recipe
function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const image = document.createElement('img');
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;

    const title = document.createElement('h2');
    title.textContent = recipe.strMeal;

    recipeCard.appendChild(image);
    recipeCard.appendChild(title);

    recipeCard.addEventListener('click', () => {
      fetchRecipeDetails(recipe.idMeal);
    });

    recipeContainer.appendChild(recipeCard);
  });
}

//Search by first Letter
const firstLetterSelect = document.getElementById('first-letter-select');

// Generate options from A to Z in select input
for (let i = 65; i <= 90; i++) { //character code for a and z
  const letter = String.fromCharCode(i);
  const option = document.createElement('option');
  option.value = letter;
  option.textContent = letter;
  firstLetterSelect.appendChild(option);
}

//event listener for Select Options
firstLetterSelect.addEventListener('change', () => {
  const selectedLetter = firstLetterSelect.value;
  if (selectedLetter) {
    searchRecipesByFirstName(selectedLetter);
    clearSelectInput(firstLetterSelect)
  }
});

//Clear Select Input function
function clearSelectInput (selectElement) {
  setTimeout(() => {
    selectElement.value = '';
  }, 4000); //4 seconds
}


async function searchRecipesByFirstName(firstName) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstName}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>No recipes found.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}



// Fetch and display recipe details by ID
async function fetchRecipeDetails(recipeId) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipeDetails(data.meals[0]);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>Recipe details not found.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

//Display Recipe Details
function displayRecipeDetails(recipe) {
  recipeContainer.innerHTML = '';

  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-details');

  const title = document.createElement('h2');
  title.textContent = recipe.strMeal;

  const category = document.createElement('p');
  category.textContent = `Category: ${recipe.strCategory}`;

  const area = document.createElement('p');
  area.textContent = `Area: ${recipe.strArea}`;

  const instructions = document.createElement('p');
  instructions.textContent = `Instructions: ${recipe.strInstructions}`;

  const image = document.createElement('img');
  image.src = recipe.strMealThumb;
  image.alt = recipe.strMeal;

  recipeCard.appendChild(image);
  recipeCard.appendChild(title);
  recipeCard.appendChild(category);
  recipeCard.appendChild(area);
  recipeCard.appendChild(instructions);

  recipeContainer.appendChild(recipeCard);
  
}

// Fetch and display all meal categories
async function fetchMealCategories() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.categories) {
      displayMealCategories(data.categories);
    } else {
      categoryContainer.innerHTML = '<p>No meal categories found.</p>';
    }
  } catch (error) {
    categoryContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayMealCategories(categories) {
  categoryContainer.innerHTML = '';

  categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');

    const name = document.createElement('h3');
    name.textContent = category.strCategory;

    const image = document.createElement('img');
    image.src = category.strCategoryThumb;
    image.alt = category.strCategory;

    categoryCard.appendChild(name);
    categoryCard.appendChild(image);

    categoryCard.addEventListener('click', () => {
      const categoryQuery = category.strCategory;

      searchRecipesByCategory(categoryQuery);
    });


    categoryContainer.appendChild(categoryCard);
  });
}

async function searchRecipesByCategory(category) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>No recipes found for this category.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Fetch and display all meal areas
async function fetchMealAreas() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayMealAreas(data.meals);
    } else {
      areaContainer.innerHTML = '<p>No meal areas found.</p>';
    }
  } catch (error) {
    areaContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayMealAreas(areas) {
  areaContainer.innerHTML = '';

  areas.forEach(area => {
    const areaCard = document.createElement('div');
    areaCard.classList.add('area-card');

    const name = document.createElement('h3');
    name.textContent = area.strArea;

    areaCard.appendChild(name);

    areaCard.addEventListener('click', () => {
      const areaQuery = area.strArea;
      searchRecipesByArea(areaQuery);

    });

    areaContainer.appendChild(areaCard);
  });
}

async function searchRecipesByArea(area) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>No recipes found for this area.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

//Random Meal Button Generator
randomButton.addEventListener('click', () => {
  getRandomMeal();
});

//Random Meal Function
async function getRandomMeal() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
      scrollToResultsView();
    } else {
      recipeContainer.innerHTML = '<p>No random meal found.</p>';
      scrollToResultsView();
    }
  } catch (error) {
    recipeContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}



// Call the fetchMealCategories and fetchMealAreas functions when the page loads
window.addEventListener('DOMContentLoaded', () => {
  fetchMealCategories();
  fetchMealAreas();
});



