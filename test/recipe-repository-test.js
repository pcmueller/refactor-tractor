import { expect } from 'chai';

import Recipe from '../src/Recipe';
import RecipeRepository from '../src/RecipeRepository';
import recipeData from './test-data/recipe-test-data';

describe('RecipeRepository', function() {
  let recipe1, recipe2, recipe3, recipeRepo;

  beforeEach(function() {
    recipe1 = new Recipe(recipeData[0]);
    recipe2 = new Recipe(recipeData[1]);
    recipe3 = new Recipe(recipeData[2]);
    recipeRepo = new RecipeRepository();
    recipeRepo.addRecipeToRepository(recipe1);
    recipeRepo.addRecipeToRepository(recipe2);
    recipeRepo.addRecipeToRepository(recipe3);
  })

  it('is a function', function() {
    expect(RecipeRepository).to.be.a('function');
  });

  it('should be an instance of RecipeRepository', function() {
    expect(recipeRepo).to.be.an.instanceof(RecipeRepository);
  });

  it('should store an array of recipes', function() {
    expect(recipeRepo.data[0].name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });
  
  it('should store an array of recipe tags', function() {    
    expect(recipeRepo.tags).to.deep.eq([]);
  });

  it('should populate the array with all recipe tags', function() {    
    const tags = [
      'antipasti',    'antipasto',
      'appetizer',    'dinner',
      "hor d'oeuvre", 'lunch',
      'main course',  'main dish',
      'sauce',        'snack',
      'starter'
    ];
    recipeRepo.populateRecipeTags();

    expect(recipeRepo.tags).to.deep.eq(tags);
  });

});