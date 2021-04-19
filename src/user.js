class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }

  saveRecipe(recipe) {
    this.favoriteRecipes.push(recipe);
  }

  removeRecipe(recipe) {
    let i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1);
  }

  removeIngredient(selected) {
    let found = this.pantry.find(item => {
      return item.ingredient === selected.ingredient;
    });
    let index = this.pantry.indexOf(found);
    this.pantry.splice(index, 1);
  }

  decideToCook(recipe) {
    this.recipesToCook.push(recipe);
  }
  
  filterRecipes(type) {
    return this.favoriteRecipes.filter(recipe => recipe.type.includes(type));
  }

  searchForRecipe(keyword) {
    return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
  }
}

module.exports = User;
