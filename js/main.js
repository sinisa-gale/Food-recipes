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
	var url = 'https://api.edamam.com/search?q=' + foodValue + '&app_id=' + id + '&app_key=' +
	key + '&from=' + fromPage + '&to=' + toPage + '&diet=' + dietValue + '&health=' + healthValue + '&calories=' + caloriesValue;

	req.open('GET', url);
	req.send();
	req.onload = function(){
		listRecipes(JSON.parse(req.responseText).hits);
		var results = document.querySelector(".recipe-count-number");
		results.textContent = JSON.parse(req.responseText).count;
		var numPages = Math.ceil(JSON.parse(req.responseText).count/10);
		numPages =  (numPages > 10) ? 10 : numPages;
		pagination(fromPage / 10 + 1, numPages);
	};
};

function listRecipes(recipes) {
	recipesList.innerHTML = "";
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

//Pagination
function pagination(currentPage, lastPage) {
	var lstPages = [];

	var range = (lastPage <= 7) ? lastPage : 7;
	var leftSide = (currentPage < 4) ? 1 : currentPage - 3;
	var rightSide = (currentPage < 4) ? range : ((lastPage - currentPage < 3) ? lastPage : currentPage + 3);
	range = rightSide - leftSide + 1;
	for (var i = 0; i < range; i++) {
		lstPages[i] = leftSide++;
	}
	addPagination(lstPages, currentPage);
	createArrows(currentPage, lastPage);
}

function addPagination(someArrayOfPages, currentPage) {
	var paginationContainer = document.querySelector(".pagination");
	paginationContainer.innerHTML = "";
	var listPages = document.createElement("div");
	listPages.classList.add("pages");
	paginationContainer.appendChild(listPages);

	for (var i = 0; i < someArrayOfPages.length; i++) {
		var pageMarker = document.createElement("span");
		pageMarker.textContent = someArrayOfPages[i];
		(someArrayOfPages[i] === currentPage) ?	pageMarker.classList.add("selected") : {};
		listPages.appendChild(pageMarker);
	}
	var pageMarkers = document.querySelectorAll(".pages span");
	pageMarkers.forEach(function(elem) {
		elem.addEventListener("click",
		function() {getRecipes(foodValue,
			(elem.textContent - 1) * 10, elem.textContent * 10)
		})
	});
}

function createArrows(myCurrentPage, myLastPage) {
	var previousPage = createArrow("previous-page");
	var firstPage = createArrow("first-page");
	var nextPage = createArrow("next-page");
	var lastPage = createArrow("last-page");

	var previous = myCurrentPage === 1 ? 1 : myCurrentPage - 1;
	var next = myCurrentPage === myLastPage ? myCurrentPage : myCurrentPage + 1;

	addListener(firstPage, 1);
	addListener(lastPage, myLastPage);
	addListener(previousPage, previous);
	addListener(nextPage, next);
}

function addListener(elem, numPages) {
	elem.addEventListener("click", function() {
		getRecipes(foodValue, (numPages - 1) * 10, numPages * 10);
	});
}

function createArrow(pageType) {
	var paginationContainer = document.querySelector(".pagination");
	var arrowDiv = document.createElement("div");
	var arrowMarker = document.createElement("span");
	arrowDiv.classList.add(pageType);
	arrowDiv.appendChild(arrowMarker);

	switch (pageType) {
		case "first-page": {
			arrowMarker.textContent = "<<";
			paginationContainer.prepend(arrowDiv);
			break;
		};
		case "previous-page": {
			arrowMarker.textContent = "<";
			paginationContainer.prepend(arrowDiv);
			break;
		};
		case "next-page": {
	 		arrowMarker.textContent = ">";
	 		paginationContainer.appendChild(arrowDiv);
			break;
	 	};
		case "last-page": {
	 		arrowMarker.textContent = ">>";
	 		paginationContainer.appendChild(arrowDiv);
			break;
	 	}
		default: break;
	}
	return arrowDiv;
}

//Events
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
