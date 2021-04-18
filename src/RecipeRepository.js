class RecipeRepository {
  constructor() {
    this.data = [];
    this.tagNames = [];
  }

  addRecipeToRepository(recipe) {
    this.data.push(recipe);
  }

  populateRecipeTags() {
    this.data.forEach(recipe => {
      recipe.tags.forEach(tag => {
        if (!this.tagNames.includes(tag)) {
          this.tagNames.push(tag);
        }
      });
    });
    this.tagNames.sort();
  }

  getRecipeByID(id) {
    return this.data.find(recipe => id === recipe.id);
  }
  
  getRecipesByTag(tags=this.tagNames) {
    return this.data.reduce((recipes, curRecipe) => {
      tags.forEach(tag => {
        if (curRecipe.tags.includes(tag.id) && !recipes.includes(curRecipe)) {
          recipes.push(curRecipe);
        }
      })
  
      return recipes;    
    }, [])
  }
}

module.exports = RecipeRepository;