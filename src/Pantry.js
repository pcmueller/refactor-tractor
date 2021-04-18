// const Ingredient = require("./Ingredient");

class Pantry {
  constructor() {
    this.data = [];
  }

  addIngredientToPantry(ingredient) {
    this.data.push(ingredient);
  }

  getIngredientName(id) {
    return this.data.find(ingredient => id === ingredient.id).name;
  }
}

module.exports = Pantry;