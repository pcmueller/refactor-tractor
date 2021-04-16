// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';

import User from './User';
import Recipe from './Recipe';
import domUpdates from './domUpdates';

import { getUserData, getRecipeData, getIngredientData} from "./net-utils.js";
import RecipeRepository from './RecipeRepository';

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector("#filter-btn");
let fullRecipeInfo = document.querySelector("#recipe-instructions");
let main = document.querySelector("main");
let menuOpen = false;
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

window.addEventListener("load", createCards);
window.addEventListener("load", findTags);
window.addEventListener("load", generateUser);
allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", domUpdates.addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);

// GENERATE A USER ON LOAD
function generateUser() {
  getUserData().then(function(userData) {
    user = new User(userData[Math.floor(Math.random() * userData.length)]);
    let firstName = user.name.split(" ")[0];
    let welcomeMsg = `
      <div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
    findPantryInfo();
  })
}

// CREATE RECIPE CARDS
function createCards() {
  getRecipeData().then(function(recipeData) {
    recipeData.forEach(recipe => {
      let recipeInfo = new Recipe(recipe);
      let shortRecipeName = recipeInfo.name;

      recipes.addRecipeToRepository(recipeInfo);

      if (recipeInfo.name.length > 40) {
        shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
      }

      domUpdates.addToDom(main, recipeInfo, shortRecipeName)
    });
  })
}

// FILTER BY RECIPE TAGS
function findTags() {
  getRecipeData().then(function(recipeData) {
    let tags = [];
    recipeData.forEach(recipe => {
      recipe.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    tags.sort();
    domUpdates.listTags(tags, capitalize, tagList);
  });
}

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
  hideUnselectedRecipes(foundRecipes)
}

function hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
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
  showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  getRecipeData().then(function(recipeData) {
    fullRecipeInfo.style.display = "inline";
    let recipeId = event.path.find(e => e.id).id;
    let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));

    getIngredientData().then(function(ingredientData) {
      domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe, ingredientData), fullRecipeInfo);
      addRecipeImage(recipe);
      generateInstructions(recipe);
      fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
    });
  });
}

function addRecipeImage(recipe) {
  document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
}

function generateIngredients(recipe, ingredientData) {
  return recipe && recipe.ingredients.map(i => {
    const ingredient = ingredientData.find(ingredient => {
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
  fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
  fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS
function showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
}

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
  getRecipeData().then(function(recipeData) {
    showAllRecipes();
    let searchedRecipes = recipeData.filter(recipe => {
      return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
    });
    filterNonSearched(createRecipeObject(searchedRecipes));
  });
}

function filterNonSearched(filtered) {
  let found = recipes.data.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.data.map(recipe => new Recipe(recipe));
  return recipes
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
  getIngredientData().then(function(ingredientData) {
    user.pantry.forEach(item => {
      let itemInfo = ingredientData.find(ingredient => {
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
  })
}

function displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
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
