import { expect } from 'chai';

import Recipe from '../src/Recipe';
import recipeData from './test-data/recipe-test-data';
import ingredientData from './test-data/ingredient-test-data';

describe.only('Recipe', function() {
  let recipeInfo;
  let recipe;

  beforeEach(function() {
    recipeInfo = recipeData[0];
    recipe = new Recipe(recipeInfo);
  })

  it('is a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
  });

  it('should initialize with an id', function() {
    expect(recipe.id).to.eq(595736);
  });

  it('should initialize with an name', function() {
    expect(recipe.name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should initialize with an image', function() {
    expect(recipe.image).to.eq('https://spoonacular.com/recipeImages/595736-556x370.jpg');
  });

  it('should initialize with an array of ingredients', function() {
    const ingredient = {
      "id": 20081,
      "quantity": {
        "amount": 1.5,
        "unit": "c"
      }
    };
    expect(recipe.ingredients[0]).to.deep.eq(ingredient);
  });

  it('should repopulate array with ingredient name and cost properties added', function() {
    recipe.retrieveIngredientPricing(ingredientData);
    const costedIngredient = {
      id: 20081,
      name: 'wheat flour',
      quantity: { amount: 1.5, unit: 'c' },
      costInCents: 142
    };

    expect(recipe.ingredients[0]).to.deep.eq(costedIngredient);
  });

  it('should calculate the total cost of all of the ingredients', function() {    
    let cost = recipe.calculateIngredientsCost(ingredientData);

    expect(cost).to.eq(177.76);
  });
});
