//
const id = 'd3189e57';
const key = 'b1b7b4a7ef79b0e69b697d36f0f7dc26';

class Food {
  #imageClip;
  #title;
  #myLabels;
  #calories;
  #calYield;

  constructor(recipeData) {
    this.#imageClip = recipeData.image;
    this.#title = recipeData.label;
    this.#myLabels = recipeData.healthLabels;
    this.#calories = recipeData.calories;
    this.#calYield = recipeData.yield;
  }

  //Setters are ommited; only getter available
  getImage = () => this.#imageClip;
  getTitle = () => this.#title;
  getMyLabels = () => this.#myLabels;
  getCalories = () => this.#calories;
  getYield = () => this.#calYield;

  appendToPage = parentNode => {
    const recipeElement = document.createElement("div");
  	recipeElement.classList.add("recipe-element");

    const imgAdd = '<img src="' + this.getImage() + '"/>';
    const titleAdd = '<h3>' + this.getTitle() + '</h3>';
    let labelsAdd = '<div class="labels">';
    this.getMyLabels().forEach(item => (labelsAdd += '<div class="label">' + item + '</div>'));
    labelsAdd += '</div>';
    const caloriesAdd = '<div class="calories">' +
      Math.round(this.getCalories() / this.getYield()) + '</div>';

    recipeElement.innerHTML = imgAdd + titleAdd + labelsAdd + caloriesAdd;
    parentNode.appendChild(recipeElement);
  }
}

export {id, key, Food};
