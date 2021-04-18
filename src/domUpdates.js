// domUpdates.js
let domUpdates = {
  menuOpen : false,
  setWelcomeMsg(firstName) {
    let welcomeMsg =
    `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
  },

  addToDom(main, recipeInfo, shortRecipeName) {
    let cardHtml = `
      <div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
    main.insertAdjacentHTML("beforeend", cardHtml);
  },

  listTags(allTags,capitalize, tagList) {
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
        <label for="${tag}">${capitalize(tag)}</label></li>`;
      tagList.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  displayRecipeInfo(recipe, ingredients, recipeInfo) {
    recipeInfo.style.display = "inline";

    this.generateRecipeTitle(recipe, ingredients, recipeInfo);
    this.addRecipeImage(recipe);
    this.generateInstructions(recipe, recipeInfo);
    this.renderAdjacentHTML(recipeInfo, "<section id='overlay'></div>");
  },

  generateRecipeTitle(recipe, ingredients, fullRecipeInfo) {
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <p>${ingredients}</p>`
    fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
  },

  addRecipeImage(recipe) {
    document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
  },

  displaySaved(unsavedRecipes) {
    unsavedRecipes.forEach(recipe => {
      const domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    
    document.querySelector(".welcome-msg").style.display = "none";
    document.querySelector(".my-recipes-banner").style.display = "block";
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  renderAdjacentHTML(fullRecipeInfo, htmlElement) {
    fullRecipeInfo.insertAdjacentHTML("beforebegin", htmlElement);
  },

  generateInstructions(recipe, fullRecipeInfo) {
    let instructionsList = "";
    let instructions = recipe.instructions.map(i => {
      return i.instruction
    });
    instructions.forEach(i => {
      instructionsList += `<li>${i}</li>`
    });
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
  },

  hideInfo(recipeInfo) {
    recipeInfo.style.display = "none";
    document.getElementById("overlay").remove();
  },

  showWelcomeBanner() {
    this.renderDisplayStyling(".welcome-msg", "flex");
    this.renderDisplayStyling(".my-recipes-banner", "none");
  },
  
  renderDisplayStyling(className, styleDisplayProperty) {
    document.querySelector(className).style.display = styleDisplayProperty;
  },

  toggleMenu() {
    var menuDropdown = document.querySelector(".drop-menu");
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  },

  displayPantryInfo(pantryData) {
    pantryData.forEach(ingredient => {
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
        <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
      document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
        ingredientHtml);
    });
  },

  removeUncheckedRecipes(recipe) {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  },
};

export default domUpdates;
