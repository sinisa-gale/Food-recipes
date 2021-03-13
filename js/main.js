//code
var id = 'd3189e57';
var key = 'b1b7b4a7ef79b0e69b697d36f0f7dc26';
var recipesList = document.querySelector('#recipes');
var searchFood = document.querySelector(".keyword-input");
var foodValue ;
var searchButton = document.querySelector(".search-button");
var diet = document.querySelector(".diet");
var dietValue = '';
var health = document.querySelector(".health");
var healthValue = '';
var calMax = document.querySelectorAll(".calories")[1];
var calMaxValue;
var calMin = document.querySelectorAll(".calories")[0];
var calMinValue;

function searchEnabled() {
	if ( calMin.value === "" || calMax.value === "" || searchFood.value ==="" || diet.value === "" || health.value === "") {
		searchButton.setAttribute("disabled", true);
	} else {
		searchButton.removeAttribute("disabled");
	};
};

function getRecipes(foodValue) {	
	var req = new XMLHttpRequest();
	var calValue;
	calValue = calMinValue + '-' + calMaxValue;
	console.log(calValue);
	req.open("GET", `https://api.edamam.com/search?q=${foodValue}&app_id=${id}&app_key=${key}&from=0&to=12&diet=${dietValue}&health=${healthValue}&calories=${calValue}`);
	req.send();
	req.onload = function(){
		listRecipes(JSON.parse(req.responseText).hits); 
		var results = document.querySelector(".recipe-count-number");
		results.textContent = JSON.parse(req.responseText).count;
	};
};

function listRecipes(recipes) {
	recipes.forEach(function(recipe) {
		addRecipes(recipe);
	});
}

function addRecipes(recipeData) {
	var recipeElement = document.createElement("div");
	recipeElement.classList.add("recipe-element");

	var img = '<img src = "' + recipeData.recipe.image + '"/>';
	var title = '<h3>' + recipeData.recipe.label + '</h3>';	
	var labels = '<div class="labels">';
	var myLabels = recipeData.recipe.healthLabels;
	myLabels.forEach((element)=> {
		var label = '<div class="label">' + element + '</div>';
		labels += label;	
	})
	labels = labels + '</div>';
	var calories = '<div class="calories">' +  Math.round(recipeData.recipe.calories / recipeData.recipe.yield) + '</div>';
	recipeElement.innerHTML = img + title + labels + calories;
	recipesList.appendChild(recipeElement);
	document.getElementById("load").style.display = "none"; 
};

searchFood.onkeyup = function() {
	foodValue = searchFood.value;
	searchEnabled();
}

diet.onchange = function() {
	dietValue = diet.value;
	searchEnabled();
}

health.onchange = function() {
	healthValue = health.value;
	searchEnabled();
}

calMax.onkeyup = function() {
	calMaxValue = calMax.value;
	searchEnabled();
}

calMin.onkeyup = function() {
	calMinValue = calMin.value;
	searchEnabled();
}

searchButton.addEventListener("click", function() {
	recipesList.innerHTML = '';
	document.getElementById("load").style.display = "block"; 
	getRecipes(foodValue);
});