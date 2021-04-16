const Ingredient = require("./Ingredient");

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.cost = 0;
  }

  retrieveIngredientPricing(data) {
    let costedIngredients = [];
    this.ingredients.forEach(ingredient => {
      return data.forEach(datum => {
        if (ingredient.id === datum.id) {
          costedIngredients.push(new Ingredient(ingredient, datum.name, datum.estimatedCostInCents));
        }
      });
    });
    this.ingredients = costedIngredients;
  }

  calculateIngredientsCost(data) {
    // console.log("in recipe - calculateIngredientsCost()", data);
    this.retrieveIngredientPricing(data);
    const cents = this.ingredients.reduce((total, item) => {
      total += item.costInCents * item.quantity.amount;
      return total;
    }, 0);
    this.cost = parseFloat((cents/100).toFixed(2));
    return this.cost;
  }
}

module.exports = Recipe;