const Ingredient = require("./Ingredient");

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.costedIngredients = [];
  }

  retrieveIngredientPricing(data) {
    this.ingredients.forEach(ingredient => {
      return data.forEach(datum => {
        if (ingredient.id === datum.id) {
          this.costedIngredients.push(new Ingredient(ingredient, datum.estimatedCostInCents));
        }
      });
    });
  }

  calculateIngredientsCost(data) {
    this.retrieveIngredientPricing(data);
    const cents = this.costedIngredients.reduce((total, item) => {
      total += item.costInCents * item.quantity.amount;
      return total;
    }, 0);
    return parseFloat((cents/100).toFixed(2));
  }
}

module.exports = Recipe;