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
  })

  it('is a function', function() {
    expect(RecipeRepository).to.be.a('function');
  });

  it('should be an instance of RecipeRepository', function() {
    expect(recipeRepo).to.be.an.instanceof(RecipeRepository);
  });

  it('should initialize with an empty array of recipes', function() {    
    expect(recipeRepo.data).to.deep.eq([]);
  });

  it('should be able to add recipe to array', function() {
    recipeRepo.addRecipeToRepository(recipe1);
    recipeRepo.addRecipeToRepository(recipe2);
    recipeRepo.addRecipeToRepository(recipe3);

    expect(recipeRepo.data[0].name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
    expect(recipeRepo.data[1].name).to.eq('Maple Dijon Apple Cider Grilled Pork Chops');
    expect(recipeRepo.data[2].name).to.eq('Dirty Steve\'s Original Wing Sauce');
  });
  
  it('should initialize with an empty array of recipe tags', function() {    
    expect(recipeRepo.tagNames).to.deep.eq([]);
  });

  it('should be able to populate the array with all recipe tags', function() {    
    recipeRepo.addRecipeToRepository(recipe1);
    recipeRepo.addRecipeToRepository(recipe2);
    recipeRepo.addRecipeToRepository(recipe3);
    recipeRepo.populateRecipeTags();

    const tags = [
      'antipasti',    'antipasto',
      'appetizer',    'dinner',
      "hor d'oeuvre", 'lunch',
      'main course',  'main dish',
      'sauce',        'snack',
      'starter'
    ];

    expect(recipeRepo.tagNames).to.deep.eq(tags);
  });

  it('should be able to find a recipe by id', function() {
    recipeRepo.addRecipeToRepository(recipe1);
    recipeRepo.populateRecipeTags();

    let recipe = recipeRepo.getRecipeByID(595736);

    expect(recipe).to.be.an('object');
    expect(recipe.name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should have a function to find recipes by tag', function() {
    expect(recipeRepo.getRecipesByTag).to.be.a('function');
  });
});