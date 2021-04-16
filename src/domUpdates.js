// domUpdates.js

let domUpdates = {
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

  addToMyRecipes() {
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
};

export default domUpdates;
