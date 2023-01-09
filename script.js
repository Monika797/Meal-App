//TOGGLE THEME
document.querySelector(".theme-toggle-button").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

//SELECT THE DOM ELEMENTS
const homebtn = document.querySelector("#home");
const favbtn = document.querySelector("#favoritesPage");
const mealsContainer = document.querySelector(".meals-container");
const favContainer = document.querySelector(".fav-container");
const searchItem = document.querySelector(".search-item");
const favMealHeadiing = document.getElementById("fav-meal-heading");
const favMeals = document.querySelector(".fav-meals");
const formSubmit = document.querySelector("form");
const searchContainer = document.querySelector(".container");
const mealDetailContainer = document.querySelector(".meal-detail");
const confirm = document.querySelector(".save-confirmed");
const noSearchResult = document.querySelector(".no-search-result");

//MEALS ARRAY DECLARATION
let meals = [];

//FAVORTITE MEALS OBJECT DECLARATION
let favoriteMeals = {};

//LOAD THE FAVORITE MEALS FROM LOCAL STORAGE INTO FAVORITE MEALS OBJECT
window.onload = getFavorites();

function getFavorites() {
  if (localStorage.getItem("mealAppFavorites")) {
    const currFav = JSON.parse(localStorage.getItem("mealAppFavorites"));
    favoriteMeals = currFav;
  }
}

//ADD EVENT LISTENER TO HOME AND FAVORITE BUTTON
homebtn.addEventListener("click", showHome);
favbtn.addEventListener("click", showFav);

//FETCH THE MEALS ON CLICKING ON SEARCH BUTTON
formSubmit.addEventListener("click", fetchmeals);

//FETCH THE MEALS BY MALING ASYNCHRONOUS REQUEST
async function fetchmeals(e) {
  e.preventDefault();
  const term = searchItem.value;

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    );
    const data = await res.json();
    meals = data.meals;
    showHome();
  } catch (error) {
    //WHEN NO RESULTS IS FOUND FOR GIVEN SEARCH ITEM
    mealsContainer.innerHTML = "  <h1>No search results found !!!</h1>";
  }
}

//RENDER MEALS FROM MEALS ARRAY
function showHome() {
  //HIDE THE FAVORTITE MEALS AND MEAL DETAILS
  favMeals.classList.add("hidden");
  mealDetailContainer.classList.add("hidden");

  //UNHIDE SEARCH AND MEALS
  searchContainer.classList.remove("hidden");
  mealsContainer.classList.remove("hidden");

  //RETURN IF THERE ARE NO MEALS
  if (meals.length === 0) {
    return;
  }

  //TRAVERSE THROUGH MEALS ARRAY AND ADD MEAL CARD FOR EACH MEAL INTO MEALS CONTAINER
  mealsContainer.innerHTML = "";
  meals.forEach((meal) => {
    const { strMeal, strMealThumb } = meal;
    const newEl = document.createElement("div");
    newEl.classList.add("meal");
    if (favoriteMeals[meal.idMeal]) {
      newEl.innerHTML = ` <a href=""
        ><img
          src=${strMealThumb}
          alt="meal-image"
      /></a>
      <div class='meal-name'>${strMeal}</div>
      <div class="meal-info">
       <button class='viewDetails'>View Details</button>
        <button class='togglebtn'>Remove from favorites</button>
      </div>`;
    } else {
      newEl.innerHTML = ` <a href=""
    ><img
      src=${strMealThumb}
      alt="meal-image"
  /></a>
  <div class='meal-name'>${strMeal}</div>
  <div class="meal-info">
  <button class='viewDetails'>View Details</button>
    <button class='togglebtn'>Add to favorites</button>
  </div>`;
    }

    //ADD EVENT LISTENER TO VIEW DETAILS OF GIVEN MEAL
    newEl
      .querySelector(".viewDetails")
      .addEventListener("click", () => mealDetails(meal));

    //ADD EVENT LISTENER TO TOGGLE BUTTON
    const togglebtn = newEl.querySelector(".togglebtn");
    togglebtn.addEventListener("click", () => togglefav(meal, togglebtn));

    //ADD THE CREATED MEAL ELEMENT TO MEAL CONAINER
    mealsContainer.appendChild(newEl);
  });
}

//TOGGLE THE FAVORITE MEAL
function togglefav(meal, togglebtn) {
  const text = togglebtn.textContent;
  if (text == "Add to favorites") {
    favoriteMeals[meal.idMeal] = meal;
    togglebtn.textContent = "Remove from favorites";

    //UPDATE FAVORITE MEALS IN LOCAL STORAGE
    localStorage.setItem("mealAppFavorites", JSON.stringify(favoriteMeals));

    //ADDED MEAL TO FAVORITE NOTIFICATION
    confirm.classList.remove("hidden");
    setTimeout(() => {
      confirm.classList.add("hidden");
    }, 2000);
  } else {
    delete favoriteMeals[meal.idMeal];
    togglebtn.textContent = "Add to favorites";
    //UPDATE FAVORITE MEALS IN LOCAL STORAGE
    localStorage.setItem("mealAppFavorites", JSON.stringify(favoriteMeals));
  }
}

//RENDER MEALS FROM FAVORITES OBJECTS
function showFav() {
  mealsContainer.classList.add("hidden");
  searchContainer.classList.add("hidden");
  mealDetailContainer.classList.add("hidden");
  favMeals.classList.remove("hidden");
  const favoriteMealsArray = Object.values(favoriteMeals);
  console.log(favoriteMealsArray);
  favContainer.innerHTML = "";
  if (favoriteMealsArray.length === 0) {
    return (favMealHeadiing.textContent =
      "Oops !! There are no favorite meals. Please add some meals to favorites....");
  } else {
    favoriteMealsArray.forEach((meal) => {
      const { strMeal, strMealThumb } = meal;
      const newEl = document.createElement("div");
      newEl.classList.add("meal");
      newEl.innerHTML = ` <a href=""
        ><img
          src=${strMealThumb}
          alt="meal-image"
      /></a>
      <div class='meal-name'>${strMeal}</div>
      <div class="meal-info">
      <button class='viewDetails'>View Details</button>
        <button class='removeFav'>Remove from favorites</button>
      </div>`;

      //ADD EVENT LISTENER TO VIEW DETAILS
      newEl
        .querySelector(".viewDetails")
        .addEventListener("click", () => mealDetails(meal));

      //ADD EVENT LISTENER TO REMOVE FROM FAVORITES
      newEl
        .querySelector(".removeFav")
        .addEventListener("click", () => removeFromFavorite(meal));
      favContainer.appendChild(newEl);
    });
  }
}

//REMOVE MEAL FROM FAVORITES
function removeFromFavorite(favMeal) {
  delete favoriteMeals[favMeal.idMeal];
  //UPDATE FAVORITE MEALS IN LOCAL STORAGE
  localStorage.setItem("mealAppFavorites", JSON.stringify(favoriteMeals));
  showFav();
}

//RENDER MEALS DETAILS
function mealDetails(meal) {
  favMeals.classList.add("hidden");
  searchContainer.classList.add("hidden");
  mealsContainer.classList.add("hidden");
  mealDetailContainer.classList.remove("hidden");

  const { strMeal, strMealThumb, strInstructions } = meal;

  mealDetailContainer.innerHTML = `<h1>${strMeal}</h1>
  <img
    src=${strMealThumb}
    alt="meal-image"
  />

  <div>
    ${strInstructions}
  </div>`;
}
