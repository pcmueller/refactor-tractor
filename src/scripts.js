// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';

import User from './User';
import Recipe from './Recipe';
import RecipeRepository from './RecipeRepository';
import Ingredient from './Ingredient';
import Pantry from './Pantry';
import domUpdates from './domUpdates';
import { getUserData, getRecipeData, getIngredientData, getAllData } from "./net-utils.js";

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector("#filter-btn");
let fullRecipeInfo = document.querySelector("#recipe-instructions");
let main = document.querySelector("main");
let menuOpen = false;
let pantry = new Pantry();
let pantryBtn = document.querySelector("#my-pantry-btn");
let pantryInfo = [];
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
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
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

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.data.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.data.filter(recipe => {
    return !filtered.includes(recipe);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes);
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
    generateInstructions(recipe);
    domUpdate.renderAdjacentHTML(fullRecipeInfo, "<section id='overlay'></div>");
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    const ingredient = pantry.data.find(ingredient => {
      return i.id === ingredient.id;
    }).name;

    return `${capitalize(ingredient)} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

function generateInstructions(recipe) {
  let instructionsList = "";
  let instructions = recipe.instructions.map(i => {
    return i.instruction
  });
  instructions.forEach(i => {
    instructionsList += `<li>${i}</li>`
  });
  domUpdate.renderAdjacentHTML(fullRecipeInfo, "<h4>Instructions</h4>");
  fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS
function showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
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

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
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
  user.pantry.forEach(item => {
    let itemInfo = pantry.data.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
};

function displayPantryInfo(pantryData) {
  pantryData.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
      <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
      ingredientHtml);
  });
}

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
