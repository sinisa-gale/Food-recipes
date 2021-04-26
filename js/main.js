import * as importData from './modules.js';
const {id, key, Product, Food} = importData;


const recipesList = document.querySelector('#recipes');
const searchFood = document.querySelector(".keyword-input");
const searchButton = document.querySelector(".search-button");
const diet = document.querySelector(".diet");
const health = document.querySelector(".health");
const calMax = document.querySelectorAll(".calories")[1];
const calMin = document.querySelectorAll(".calories")[0];

let foodValue, calMaxValue, calMinValue;
let dietValue = '', healthValue = '';


//Functions
const searchEnabled = () => {
	if (calMin.value === "" || calMax.value === "" || searchFood.value === "" || diet.value === "" || health.value === "") {
		searchButton.setAttribute("disabled", true);
	} else {
		searchButton.removeAttribute("disabled");
	};
};

const getRecipes = (foodValue, fromPage, toPage) => {
	let caloriesValue = calMinValue + '-' + calMaxValue;
	let url = `https://api.edamam.com/search?q=${foodValue}&app_id=${id}&app_key=
	${key}&from=${fromPage}&to=${toPage}&diet=${dietValue}&health=
	${healthValue}&calories=${caloriesValue}`;

	fetch(url)
	.then(response => {
		return response.json();
	})
	.then(data => {
		listRecipes(data.hits);
		const results = document.querySelector(".recipe-count-number");
		data.count === 0 ? alert("No results found") : results.textContent = data.count;
		let numPages = Math.ceil(data.count/10);
		numPages =  (numPages > 10) ? 10 : numPages;
		pagination(fromPage / 10 + 1, numPages);
	})
	.catch(ex => {
		alert(`Error ${ex}`);
	})
};

const listRecipes = recipes => {
	recipesList.innerHTML = "";
	recipes.forEach(item => {
		let recipeFood = new Food(item.recipe);
		recipeFood.appendToPage(recipesList);
		document.getElementById("load").style.display = "none";
	});
}

//Pagination
const pagination = (currentPage, lastPage) => {
	const lstPages = [];

	let range = (lastPage <= 7) ? lastPage : 7;
	let leftSide = (currentPage < 4) ? 1 : currentPage - 3;
	const rightSide = (currentPage < 4) ? range : ((lastPage - currentPage < 3) ? lastPage : currentPage + 3);
	range = rightSide - leftSide + 1;
	for (let i = 0; i < range; i++) {
		lstPages[i] = leftSide++;
	}
	addPagination(lstPages, currentPage);
	createArrows(currentPage, lastPage);
}

const addPagination = (someArrayOfPages, currentPage) => {
	const paginationContainer = document.querySelector(".pagination");
	paginationContainer.innerHTML = "";
	const listPages = document.createElement("div");
	listPages.classList.add("pages");
	paginationContainer.appendChild(listPages);

	for (let i = 0; i < someArrayOfPages.length; i++) {
		const pageMarker = document.createElement("span");
		pageMarker.textContent = someArrayOfPages[i];
		(someArrayOfPages[i] === currentPage) ?	pageMarker.classList.add("selected") : {};
		listPages.appendChild(pageMarker);
	}
	const pageMarkers = document.querySelectorAll(".pages span");
	pageMarkers.forEach(elem => {
		elem.addEventListener("click", () => {
			getRecipes(foodValue,
			(elem.textContent - 1) * 10, elem.textContent * 10)
		})
	});
}

const createArrows = (myCurrentPage, myLastPage) => {
	let previousPage = createArrow("previous-page");
	let firstPage = createArrow("first-page");
	let nextPage = createArrow("next-page");
	let lastPage = createArrow("last-page");

	const previous = myCurrentPage === 1 ? 1 : myCurrentPage - 1;
	const next = myCurrentPage === myLastPage ? myCurrentPage : myCurrentPage + 1;

	addListener(firstPage, 1);
	addListener(lastPage, myLastPage);
	addListener(previousPage, previous);
	addListener(nextPage, next);
}

const addListener = (elem, numPages) => {
	elem.addEventListener("click", () => {
		getRecipes(foodValue, (numPages - 1) * 10, numPages * 10);
	});
}

const createArrow = pageType => {
	const paginationContainer = document.querySelector(".pagination");
	const arrowDiv = document.createElement("div");
	const arrowMarker = document.createElement("span");
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
searchFood.addEventListener('keyup', () => {
	foodValue = searchFood.value;
	searchEnabled();
})

diet.addEventListener('change', () => {
	dietValue = diet.value;
	searchEnabled();
})

health.addEventListener('change', () => {
	healthValue = health.value;
	searchEnabled();
})

calMax.addEventListener('keyup', () => {
	calMaxValue = calMax.value;
	searchEnabled();
})

calMin.addEventListener('keyup', () => {
	calMinValue = calMin.value;
	searchEnabled();
})

searchButton.addEventListener("click", () => {
	recipesList.innerHTML = '';
	document.getElementById("load").style.display = "block";
	getRecipes(foodValue, 0, 10);
});
