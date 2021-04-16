// const Ingredient = require("./Ingredient");

class Pantry {
  constructor() {
    this.data = [];
  }

  addIngredientToPantry(ingredient) {
    this.data.push(ingredient);
  }
}

module.exports = Pantry;