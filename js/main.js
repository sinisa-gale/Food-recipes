//Variable declarations
var id = 'd3189e57';
var key = 'b1b7b4a7ef79b0e69b697d36f0f7dc26';

var recipesList = document.querySelector('#recipes');
var searchFood = document.querySelector(".keyword-input");
var searchButton = document.querySelector(".search-button");
var diet = document.querySelector(".diet");
var health = document.querySelector(".health");
var calMax = document.querySelectorAll(".calories")[1];
var calMin = document.querySelectorAll(".calories")[0];

var foodValue, calMaxValue, calMinValue;
var dietValue = '', healthValue = '';


//Functions
function searchEnabled() {
	if (calMin.value === "" || calMax.value === "" || searchFood.value === "" || diet.value === "" || health.value === "") {
		searchButton.setAttribute("disabled", true);
	} else {
		searchButton.removeAttribute("disabled");
	};
};

function getRecipes(foodValue, fromPage, toPage) {	
	var req = new XMLHttpRequest();
	var caloriesValue = calMinValue + '-' + calMaxValue;
	var url = 'https://api.edamam.com/search?q=' + foodValue + '&app_id=' + id + '&app_key=' + key + '&from=' + fromPage + '&to=' + toPage + '&diet=' + dietValue + '&health=' + healthValue + '&calories=' + caloriesValue;
	
	req.open('GET', url);
	req.send();
	req.onload = function(){
		listRecipes(JSON.parse(req.responseText).hits);
		var results = document.querySelector(".recipe-count-number");
		results.textContent = JSON.parse(req.responseText).count;
	};
};

function listRecipes(recipes) {
	recipes.forEach(function(item) {
		addRecipes(item.recipe);
	});
}

function addRecipes(recipeData) {
	var recipeElement = document.createElement("div");
	recipeElement.classList.add("recipe-element");

	var img = '<img src="' + recipeData.image + '"/>';
	var title = '<h3>' + recipeData.label + '</h3>';	
	var labels = '<div class="labels">';
	var myLabels = recipeData.healthLabels;
	myLabels.forEach(function(item) {
		var label = '<div class="label">' + item + '</div>';
		labels += label;	
	})

	labels = labels + '</div>';
	var calories = '<div class="calories">' +  Math.round(recipeData.calories / recipeData.yield) + '</div>';
	recipeElement.innerHTML = img + title + labels + calories;
	recipesList.appendChild(recipeElement);
	document.getElementById("load").style.display = "none"; 
};

searchFood.addEventListener('keyup', function() {
	foodValue = searchFood.value;
	searchEnabled();
})

diet.addEventListener('change', function() {
	dietValue = diet.value;
	searchEnabled();
})

health.addEventListener('change', function() {
	healthValue = health.value;
	searchEnabled();
})

calMax.addEventListener('keyup', function() {
	calMaxValue = calMax.value;
	searchEnabled();
})

calMin.addEventListener('keyup', function() {
	calMinValue = calMin.value;
	searchEnabled();
})

searchButton.addEventListener("click", function() {
	recipesList.innerHTML = '';
	document.getElementById("load").style.display = "block"; 
	getRecipes(foodValue, 0, 10);
});