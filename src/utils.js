// Functions for fetching data from endpoints

function getAllData() {
  const promises = [ getUserData(), getRecipeData(), getIngredientData() ];
  return Promise.all(promises).catch(error => {
    `${error}: Error retrieving all data`;
  });
}

function getData(url) {
  return fetch(url).then(resp => resp.json()
    .catch(error => `${error}: Error retrieving data from ${url}`));
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

// Functions for general purpose

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

export { 
  getUserData, 
  getRecipeData, 
  getIngredientData, 
  getAllData,
  capitalize };
