class Ingredient {
  constructor(ingredient = undefined, name = undefined, cost = undefined) {
    this.id = ingredient.id;
    this.name = ingredient.name || name;
    this.costInCents = ingredient.estimatedCostInCents || cost;
    this.quantity = ingredient.quantity;
  }
}

module.exports = Ingredient;