import { expect } from 'chai';

import Pantry from '../src/Pantry';
import Ingredient from '../src/Ingredient';
import ingredientData from './test-data/ingredient-test-data';

describe('Pantry', function() {
  let ingredient1, ingredient2, ingredient3, pantry;

  beforeEach(function() {
    ingredient1 = new Ingredient(ingredientData[0]);
    ingredient2 = new Ingredient(ingredientData[1]);
    ingredient3 = new Ingredient(ingredientData[2]);
    pantry = new Pantry();
    pantry.addIngredientToPantry(ingredient1);
    pantry.addIngredientToPantry(ingredient2);
    pantry.addIngredientToPantry(ingredient3);
  });

  it('is a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', function() {
    expect(pantry).to.be.an.instanceof(Pantry);
  });

  it('should store an array of ingredients', function() {
    expect(pantry.data[0]).to.deep.eq({
      id: 20081,
      name: 'wheat flour',
      costInCents: 142,
      quantity: undefined,
    });
  });

});
