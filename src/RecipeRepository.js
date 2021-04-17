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

  getRecipesByTag(tags) {
    return this.data.reduce((acc, cur) => {
      tags.forEach(tag => {
        if (cur.tags.includes(tag.id) && !acc.includes(cur)) {
          acc.push(cur);
        }
      })
  
      return acc;    
    }, [])
  }

}

module.exports = RecipeRepository;