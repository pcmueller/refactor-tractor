class Ingredient {
  constructor(ingredient = undefined, cost = undefined) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.quantity = ingredient.quantity;
    this.costInCents = cost;
  }
}

module.exports = Ingredient;