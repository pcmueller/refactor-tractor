// const Ingredient = require("./Ingredient");

class Pantry {
  constructor() {
    this.data = [];
  }

  addIngredientToPantry(ingredient) {
    this.data.push(ingredient);
  }

  getIngredientName(id) {
   let match = this.data.find(ingredient => id === ingredient.id)
   if (match) {
     return match.name
   } else {
     return `Sorry, there's no ingredient stored under id #${id}!`;
   }
  }
}

module.exports = Pantry;