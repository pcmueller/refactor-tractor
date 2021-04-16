const Recipe = require("./Recipe");

class RecipeRepository {
  constructor() {
    this.data = [];
    this.tagNames = [];
  }

  addRecipeToRepository(recipe) {
    this.data.push(recipe);
  }

  populateRecipeTags() {
    this.data.forEach(recipe => {
      recipe.tags.forEach(tag => {
        if (!this.tagNames.includes(tag)) {
          this.tagNames.push(tag);
        }
      });
    });
    this.tagNames.sort();
  }

}

module.exports = RecipeRepository;