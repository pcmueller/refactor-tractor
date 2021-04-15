class Ingredient {
  constructor(ingredient = undefined, name = undefined, cost = undefined) {
    this.id = ingredient.id;
    this.name = name;
    this.quantity = ingredient.quantity;
    this.costInCents = cost;
  }
}

module.exports = Ingredient;