// Functions for fetching data from endpoints

async function getData(url) {
  const resp = await fetch(url);
  const data = await resp.json();

  return data;
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

export { getUserData, getRecipeData, getIngredientData };
