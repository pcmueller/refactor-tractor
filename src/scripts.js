// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';

import User from './User';
import Recipe from './Recipe';
import RecipeRepository from './RecipeRepository';
import Ingredient from './Ingredient';
import Pantry from './Pantry';
import domUpdates from './domUpdates';
import { getAllData } from "./net-utils.js";

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector("#filter-btn");
let fullRecipeInfo = document.querySelector("#recipe-instructions");
let main = document.querySelector("main");
let pantry = new Pantry();
let pantryBtn = document.querySelector("#my-pantry-btn");
let savedRecipesBtn = document.querySelector("#saved-recipes-btn");
let searchBtn = document.querySelector("#search-btn");
let recipes = new RecipeRepository();
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector("#show-pantry-recipes-btn");
let tagList = document.querySelector("#tag-list");
let user;

window.addEventListener("load", loadData);
allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", filterByRecipe);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", domUpdates.toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);

function loadData() {
  getAllData().then(function(data) {
    createPantry(data[2]);
    createCards(data[1]);
    generateUser(data[0]);
  });
}

// CREATE PANTRY

function createPantry(ingredientData) {
  ingredientData.forEach(ingredient => {
    let ingredientInfo = new Ingredient(ingredient);
    pantry.addIngredientToPantry(ingredientInfo);
  });
}

// CREATE RECIPE CARDS

function createCards(recipeData) {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipeInfo.calculateIngredientsCost(pantry.data);
    recipes.addRecipeToRepository(recipeInfo);


    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }

    domUpdates.addToDom(main, recipeInfo, shortRecipeName)
  });

  recipes.populateRecipeTags();
  domUpdates.listTags(recipes.tagNames, capitalize, tagList);
}

// GENERATE A USER

function generateUser(userData) {
  user = new User(userData[Math.floor(Math.random() * userData.length)]);
  let firstName = user.name.split(" ")[0];
  domUpdates.setWelcomeMsg(firstName);
  findPantryInfo();
}

// FILTER BY RECIPE TAGS

function filterByRecipe() {
  const checkedTags = findCheckedBoxes();
  const filteredRecipes = recipes.getRecipesByTag(checkedTags);

  showAllRecipes();
  filterRecipes(filteredRecipes);
}

function findCheckedBoxes() {
  const checkboxes = Array.from(document.querySelectorAll(".checked-tag"));
  return checkboxes.filter(box => box.checked);
}

function filterRecipes(filteredRecipes) {
  let unselectedRecipes = recipes.data.filter(recipe => {
    return !filteredRecipes.includes(recipe);
  });

  if (unselectedRecipes.length !== recipes.data.length) {
    domUpdates.hideUnselectedRecipes(unselectedRecipes);
  }
}

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

// FAVORITE RECIPE FUNCTIONALITY

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function showSavedRecipes() {
  let unsavedRecipes = recipes.data.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  domUpdates.showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS

function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

function openRecipeInfo(event) {
    let recipeId = event.path.find(e => e.id).id;
    let recipe = recipes.data.find(recipe => recipe.id === Number(recipeId));

    fullRecipeInfo.style.display = "inline";
    domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe), fullRecipeInfo);
    domUpdates.addRecipeImage(recipe);
    domUpdates.generateInstructions(recipe, fullRecipeInfo);
    domUpdates.renderAdjacentHTML(fullRecipeInfo, "<section id='overlay'></div>");
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    const ingredient = pantry.data.find(ingredient => {
      return i.id === ingredient.id;
    }).name;

    return `${capitalize(ingredient)} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  domUpdates.removeStyling("overlay");
}

// TOGGLE DISPLAYS
function showWelcomeBanner() {
  domUpdates.renderDisplayStyling(".welcome-msg", "flex");
  domUpdates.renderDisplayStyling(".my-recipes-banner", "none");
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  showAllRecipes();
  let searchedRecipes = recipes.data.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(searchedRecipes);
}

function filterNonSearched(filtered) {
  let found = recipes.data.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  domUpdates.hideUnselectedRecipes(found);
}

function showAllRecipes() {
  recipes.data.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
}

// CREATE AND USE PANTRY

function findPantryInfo() {
  let pantryInfo = [];

  user.pantry.forEach(item => {
    pantry.data.forEach(ingredient => {
      if (item.ingredient === ingredient.id) {
        pantryInfo.push({name: ingredient.name, count: item.amount});
      }
    });
  });
  
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
};

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes();
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.data.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
}
