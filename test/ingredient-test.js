import { expect } from 'chai';

import Ingredient from '../src/Ingredient';
import data from './test-data/ingredient-test-data';

describe('Ingredient', function() {
  let ingredient;
  let ingredientInfo;

  beforeEach(function() {
    ingredientInfo = data[0];
    ingredient = new Ingredient(ingredientInfo);
  })

  it('is a function', function() {
    expect(Ingredient).to.be.a('function');
  });

  it('should be an instance of Ingredient', function() {
    expect(ingredient).to.be.an.instanceof(Ingredient);
  });

  it('should initialize with an id', function() {
    expect(ingredient.id).to.eq(20081);
  });

  it('should initialize with an name', function() {
    expect(ingredient.name).to.eq(undefined);
  });

  it('should initialize with a quantity', function() {
    expect(ingredient.quantity).to.eq(undefined);
  });

  it('should initialize with an estimated cost in cents', function() {
    expect(ingredient.costInCents).to.eq(undefined);
  });
});