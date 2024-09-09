// Javascript to initially populate my-recipes template section with images and titles of recipes randomly fetched from themealdb api
document.addEventListener("DOMContentLoaded", () => {
    const savedMyRecipesSection = document.querySelector("#my-recipes");
    const loadMoreButton = document.querySelector(".load-more-button");
  
    function fetchRecipeData() {
      return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => data.meals[0])
        .catch(error => {
          console.error("Error fetching recipe data:", error);
          return null;
        });
    }
  
    // This part is from ChatGPT, comments are my own to follow along the process:
    // Creating new recipe cards with fetched info: image and recipe name
    function createRecipeCard(recipe) {
        // Define new recipe card as a hyperlink element (same as exisiting row of recipe cards)
      const recipeCard = document.createElement('a');

        // Assign default properties of <a> tag, give new element class name so gets same styling and define html of this element
      recipeCard.href = "#";
      recipeCard.className = "recipe-card";
        // Define where fetched data goes using insert variable ${ }
      recipeCard.innerHTML = `
        <article>
          <div class="image-container">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="100" height="100"/>
          </div>
          <div class="recipe-card-content">
            <p>by Me</p>
            <h4>"${recipe.strMeal}"</h4>
          </div>
        </article>
      `;
      return recipeCard;
    }

    // For loop to calling the create recipe card and inserting this before the load more button 
    function addRecipesToSection(recipes) {
      recipes.forEach(recipe => {
        if (recipe) {
          const recipeCard = createRecipeCard(recipe);
          savedMyRecipesSection.insertBefore(recipeCard, loadMoreButton.parentNode);
        }
      });
    }
  
    // This function populates the existing initial elements on load, similar to the fetch dog pictures in tutorial
    function updateExistingRecipes() {
      const recipeCards = savedMyRecipesSection.querySelectorAll(".recipe-card");
      recipeCards.forEach(card => {
        fetchRecipeData().then(meal => {
          if (meal) {
            const img = card.querySelector("img");
            const title = card.querySelector("h4");
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;
            title.textContent = `"${meal.strMeal}"`;
          }
        });
      });
    }
  
    // Calls 'promise' to create a new row of recipes (4) when button is pressed 
    function loadMoreRecipes() {
      const recipePromises = Array.from({ length: 4 }, fetchRecipeData);
      Promise.all(recipePromises).then(recipes => {
        addRecipesToSection(recipes);
      });
    }
  
    // Initial call to populate recipes on page load
    updateExistingRecipes();
  
    // Attach the loadMoreRecipes function to the button click event
    loadMoreButton.addEventListener("click", loadMoreRecipes);
  });