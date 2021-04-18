// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';

import User from './User';
import Recipe from './Recipe';
import RecipeRepository from './RecipeRepository';
import Ingredient from './Ingredient';
import Pantry from './Pantry';
import domUpdates from './domUpdates';
import { getAllData, capitalize } from "./utils.js";

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
main.addEventListener("click", performActionOnMain);
pantryBtn.addEventListener("click", domUpdates.toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", identifyCheckedPantryIngredients);
searchForm.addEventListener("submit", pressEnterSearch);

// PAGELOAD HANDLER

function loadData() {
  getAllData()
    .then(function(data) {
      createPantry(data[2]);
      createCards(data[1]);
      generateUser(data[0]);
    });
}

// CREATE PANTRY

function createPantry(ingredientData) {
  ingredientData.forEach(ingredient => {
    const ingredientInfo = new Ingredient(ingredient);
    pantry.addIngredientToPantry(ingredientInfo);
  });
}

// CREATE RECIPE CARDS

function createCards(recipeData) {
  recipeData.forEach(datum => {
    const recipe = new Recipe(datum);
    let recipeName = recipe.name;
    recipe.calculateIngredientsCost(pantry.data);
    recipes.addRecipeToRepository(recipe);

    if (recipeName.length > 40) {
      recipeName = recipeName.substring(0, 40) + "...";
    }

    domUpdates.addToDom(main, recipe, recipeName)
  });

  recipes.populateRecipeTags();
  domUpdates.listTags(recipes.tagNames, capitalize, tagList);
}

// GENERATE A USER

function generateUser(userData) {
  user = new User(getRandomUserData(userData));
  const firstName = user.name.split(" ")[0];

  domUpdates.setWelcomeMsg(firstName);
  findPantryInfo();
}

function getRandomUserData(userData) {
  return userData[Math.floor(Math.random() * userData.length)];
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

// MAIN SECTION HANDLER

function performActionOnMain(event) {
  if (event.target.className === "card-apple-icon") {
    toggleSaved(event);
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

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

// FAVORITE RECIPE FUNCTIONALITY

function toggleSaved(event) {
  const cardId = parseInt(event.target.closest(".recipe-card").id);

  if (!user.favoriteRecipes.includes(cardId)) {
    event.target.src = "../images/apple-logo.png";
    user.saveRecipe(cardId);
  } else {
    event.target.src = "../images/apple-logo-outline.png";
    user.removeRecipe(cardId);
  }
}

function showSavedRecipes() {
  const unsavedRecipes = recipes.data.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });

  domUpdates.displaySaved(unsavedRecipes);
}

// CREATE RECIPE INSTRUCTIONS

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

  let searchedNames = searchRecipeNames();
  let searchedIngredients = searchRecipeIngredients();
  let searchedRecipes = searchedNames.concat(searchedIngredients);
  
  filterNonSearched(searchedRecipes);
}

function searchRecipeNames() {
  return recipes.data.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
}

function searchRecipeIngredients() {
  return recipes.data.reduce((matches, recipe) => {
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
        matches.push(recipe);
      }
    });
    return matches;
  },[]);
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

function identifyCheckedPantryIngredients() {
  showAllRecipes();

  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  });
  let checkedNames = selectedIngredients.map(item => {
    return item.id;
  });

  if (checkedNames.length > 0) {
    findRecipesWithCheckedIngredients(checkedNames);
  }
}

function findRecipesWithCheckedIngredients(checkedNames) {

  recipes.data.forEach(recipe => {

    let recipeIngredientNames = [];

    recipe.ingredients.forEach(ingredient => {
      recipeIngredientNames.push(ingredient.name);
    });

    let matchCounter = recipeIngredientNames.reduce((itemMatches, ingredient) => {
      checkedNames.forEach(name => {
        if (name === ingredient) {
          itemMatches++;
        }
      });
      return itemMatches;
    }, 0);

    if (matchCounter < checkedNames.length) {
      domUpdates.removeUncheckedRecipes(recipe);
    }
  });
}