// =========================
// Global Variables
// =========================
var APP_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";

// ============================================================================================================================
// Yummly APIs: Search Recipe API, Get Recipe API
// Yummly API Documentation: https://developer.yummly.com/documentation
// ============================================================================================================================

// =========================
// Recipe Object
// =========================

var recipe = {
    name: "",
    id: "",
    ingredients: "",
    rating: "",
    source: "",
}

//** Event for when user searches for recipe

$(document).on("change", "#search", function() {

    // =========================
    // Search Criteria
    // =========================

    var searchLimit = 1;               // can be set by user
    var searchTerm = $(this).val();

    // =========================
    // SEARCH Recipe API Query
    // =========================

    // Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

    var base_searchRecipeUrl = "http://api.yummly.com/v1/api/recipes?_";
    var searchRecipeUrl = `${base_searchRecipeUrl}app_id=${APP_ID}&_app_key=${APP_KEY}&q=${searchTerm}`;

    $.ajax({
        url: searchRecipeUrl,
        method: "GET"
    })
    .then(function(response) {

        for (var i=0; i < searchLimit; i++) {

            //console.log(response.matches[i]);

            recipe.name = response.matches[i].recipeName;
            recipe.id = response.matches[i].id;
            recipe.ingredients = response.matches[i].ingredients;
            recipe.rating = response.matches[i].rating;

            var recipeDiv = $("<div>");

            recipeDiv.addClass("recipeDiv");

            recipeDiv.attr("data-name", recipe.name);
            recipeDiv.attr("data-id", recipe.id);
            recipeDiv.attr("data-rating", recipe.rating);

            recipeDiv.html(
                `${recipe.name}`
            );

            $("#recipeList").append(recipeDiv);
        }
    });
});

//** Event for when user clicks on recipe

$(document).on("tap", ".recipeDiv", function() {

    // =========================
    // GET Recipe Ajax Query
    // =========================

    // Get Recipe URL Format: http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY

    var base_getRecipeUrl = "http://api.yummly.com/v1/api/recipe/";
    var getRecipeUrl = `${base_getRecipeUrl}${recipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

    $.ajax({
        url: getRecipeUrl,
        method: "GET",
    })
    .then(function(response) {
        console.log(response);

        recipe.source = response.source.sourceRecipeUrl;
	//getNutrition(response); for addition later
    });

    //console.log(recipe);
    addToGroceryList(recipe);
    
});

// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================

document.addEventListener('prechange', function(event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});
