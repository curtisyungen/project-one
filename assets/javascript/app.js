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

var recipeArray = [];

//** Event for when user searches for recipe

$(document).on("change", "#search", function() {

    // Clear search result list

    $("#recipeList").empty();
    recipeArray = [];

    // =========================
    // Search Criteria
    // =========================

    var searchLimit = 2;               // can be set by user
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

	    var recipe = {
              name: "",
              id: "",
              arrayId: "",
              ingredients: [],
              rating: "",
              smallImageUrl: "",
              source: "",
            }

            recipe.name = response.matches[i].recipeName;
            recipe.id = response.matches[i].id;
            recipe.arrayId = i;
            recipe.ingredients = response.matches[i].ingredients;
            recipe.rating = response.matches[i].rating;
            recipe.smallImgUrl = response.matches[i].smallImageUrls[0];

	    recipeArray.push(recipe);

            var recipeDiv = $("<div>");

            recipeDiv.addClass("recipeDiv");

            recipeDiv.html(
                `<img src=${recipe.smallImgUrl}> 
                 <span>${recipe.name}</span> 
                 <div class="select" data-arrayId=${recipe.arrayId}>Select</div>`
            );

            $("#recipeList").append(recipeDiv);
        }
    });
});

//** Event for when user clicks on recipe to view DETAILS

$(document).on("tap", ".recipeDiv", function() {

    // ***** TO BE WRITTEN *****

});

//** Event for when user clicks SELECT, indicating an intent to make this recipe

$(document).on("tap", ".select", function() {

    var selected = $(this);

    // Get the ingredients from the selected recipe

    var getArrayId = $(this).attr("data-arrayId");
    var selectedRecipe = recipeArray[getArrayId];

    // Toggle whether or not a particular recipe is selected or not

    if (selected.attr("data-selected") == "true") {
        selected.text("Select");
        selected.css("color", "black");
        selected.attr("data-selected", "false");

        removeFromGroceryList(selectedRecipe);
    }
    else {
        selected.text("Selected");
        selected.css("color", "blue");
        selected.attr("data-selected", "true");
    
        // =========================
        // GET Recipe Ajax Query
        // =========================

        // Get Recipe URL Format: http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY

        var base_getRecipeUrl = "http://api.yummly.com/v1/api/recipe/";
        var getRecipeUrl = `${base_getRecipeUrl}${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

        $.ajax({
            url: getRecipeUrl,
            method: "GET",
        })
        .then(function(response) {
            //console.log(response);

            selectedRecipe.source = response.source.sourceRecipeUrl;
            //getNutrition(response); for addition later
        
        });

        addToGroceryList(selectedRecipe);
    }
    
});

// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================

document.addEventListener('prechange', function(event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});