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
      <button tabindex="0" class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <input type="image" tabindex="0" src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </button>`
    main.insertAdjacentHTML("beforeend", cardHtml);
  },

  listTags(allTags,capitalize, tagList) {
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
        <label for="${tag}">${capitalize(tag)}</label></li>`;
      tagList.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  displayRecipeInfo(recipe, ingredients, recipeInfo, body) {
    recipeInfo.style.display = "inline";
    body.classList.toggle("no-scroll");

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
    fullRecipeInfo.focus();
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

  hideInfo(recipeInfo, body) {
    recipeInfo.style.display = "none";
    body.classList.toggle("no-scroll");
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

  showRecipe(recipe) {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  },

  hideRecipe(recipe) {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  },

  openFilterMenu(filterMenu) {
    this.renderAdjacentHTML(filterMenu, "<section id='overlay'></div>");
    filterMenu.classList.toggle("open");
  },

  closeFilterMenu(filterMenu) {
    document.getElementById("overlay").remove();
    filterMenu.classList.toggle("open");
  },

  toggleSearch() {
    this.toggleNavElements();
    this.toggleSearchBar();
    this.toggleBackBtn();
  },

  toggleNavElements() {
    const myRecipes = document.querySelector("#saved-recipes-btn");
    const myPantry = document.querySelector("#my-pantry-btn");

    myRecipes.classList.toggle("hidden");
    myPantry.classList.toggle("hidden");
  },

  toggleSearchBar() {
    const searchBar = document.querySelector("#search");
    const mobileSearchBtn = document.getElementById("mobileSearchBtn");

    searchBar.classList.toggle("displayed-flex");
    mobileSearchBtn.classList.toggle("hidden");
  },

  toggleBackBtn() {
    const mobileBurger = document.querySelector("#mobileBurger");
    const backBtn = document.querySelector("#backBtn");

    mobileBurger.classList.toggle("hidden");
    backBtn.classList.toggle("displayed-inline");
  }
};

export default domUpdates;