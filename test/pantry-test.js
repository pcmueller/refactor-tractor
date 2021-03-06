import { expect } from 'chai';

import Pantry from '../src/Pantry';
import Ingredient from '../src/Ingredient';
import ingredientData from './test-data/ingredient-test-data';

describe('Pantry', function() {
  let ingredient, pantry;

  beforeEach(function() {
    ingredient = new Ingredient(ingredientData[0]);
    pantry = new Pantry();
  });

  it('is a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', function() {
    expect(pantry).to.be.an.instanceof(Pantry);
  });

  it('should initialize with an empty array of ingredients', function() {
    expect(pantry.data).to.deep.eq([]);
  });

  it('should be able to add objects to ingredients array', function() {
    pantry.addIngredientToPantry(ingredient);

    expect(pantry.data[0]).to.deep.eq({
      id: 20081,
      name: 'wheat flour',
      costInCents: 142,
      quantity: undefined,
    });
  });

  it('should be able to retrieve the name of an ingredient by id number', function() {
    pantry.addIngredientToPantry(ingredient);
    let nameHappyPath = pantry.getIngredientName(20081);
    let nameSadPath = pantry.getIngredientName(99999)

    expect(nameHappyPath).to.eq('wheat flour');
    expect(nameSadPath).to.eq(`Sorry, there's no ingredient stored under id #99999!`);
  });
});
