// Functions for fetching data from endpoints

function getAllData() {
  const promises = [ getUserData(), getRecipeData(), getIngredientData() ];
  return Promise.all(promises);
}

function getData(url) {
  return fetch(url).then(resp => resp.json());
}

function getUserData() {
  return getData("http://localhost:3001/api/v1/users");
}

function getRecipeData() {
  return getData("http://localhost:3001/api/v1/recipes");
}

function getIngredientData() {
  return getData("http://localhost:3001/api/v1/ingredients");
}

export { 
  getUserData, 
  getRecipeData, 
  getIngredientData, 
  getAllData };
