const Recipe = require("./Recipe");

class RecipeRepository {
  constructor() {
    this.data = [];
  }

  addRecipeToRepository(recipe) {
    this.data.push(new Recipe(recipe));
  }
}

module.exports = RecipeRepository;