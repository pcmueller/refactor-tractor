const Recipe = require("./Recipe");

class RecipeRepository {
  constructor() {
    this.data = [];
    this.tags = [];
  }

  addRecipeToRepository(recipe) {
    this.data.push(new Recipe(recipe));
  }

  populateRecipeTags() {
    this.data.forEach(recipe => {
      recipe.tags.forEach(tag => {
        if (!this.tags.includes(tag)) {
          this.tags.push(tag);
        }
      });
    });
    this.tags.sort();
  }
}

module.exports = RecipeRepository;