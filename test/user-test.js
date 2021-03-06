import { expect } from 'chai';

import User from '../src/User';
import data from './test-data/users-test-data';

describe('User', function() {
  let user;
  let userInfo;
  let recipe;

  beforeEach(function() {
    userInfo = data[0];
    user = new User(userInfo)

    recipe = {name: 'Chicken Parm', type: ['italian', 'dinner']};
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
  });

  it('should be able to remove a recipe from favoriteRecipes', function() {
    user.removeRecipe(recipe);
    expect(user.favoriteRecipes[0]).to.equal(undefined);
  });

  it('should be able to add an ingredient to pantry', function() {
    user.addIngredientToPantry({'id': 6971, 'name': 'worcestershire', 'estimatedCostInCents': 57});

    expect(user.pantry[228].ingredient).to.equal(6971);
  });

  it('should increment ingredient amount if it already exists in pantry', function() {
    user.addIngredientToPantry({'id': 11477, 'name': 'zucchini squash', 'estimatedCostInCents': 742});

    expect(user.pantry[0].amount).to.equal(2);
  });

  it('should be able to remove an ingredient from pantry', function() {
    user.removeIngredientFromPantry({ ingredient: 11477, amount: 1 });
    expect(user.pantry[0]).to.deep.equal({ ingredient: 93820, amount: 1 });
  });

  it('should be able to decide to cook a recipe', function() {
    user.decideToCook(recipe);
    expect(user.recipesToCook[0].name).to.equal('Chicken Parm');
  });

  it('should be able to filter recipes by type', function() {
    user.saveRecipe(recipe);
    expect(user.filterRecipes('italian')).to.deep.equal([recipe]);
  });

  it('should be able to search recipes by name', function() {
    user.saveRecipe(recipe);
    expect(user.searchForRecipe('Chicken Parm')).to.deep.equal([recipe]);
  });
});
