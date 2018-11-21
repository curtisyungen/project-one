$(document).on("change", "#search", function () {
    var searchTerm = $(this).val();
});

// ============================================================================================================================
// Yummly API / Ajax
// ============================================================================================================================

// var queryURL = "http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion"
// https://developer.yummly.com/documentation

var baseURL = "http://api.yummly.com/v1/api/recipes?_";
var API_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var searchTerm = "chicken";
var searchLimit = 1;             // can be set by user

var queryURL = `${baseURL}app_id=${APP_ID}&_app_key=${API_KEY}&q=${searchTerm}`;

// ================
// Recipe Object
// ================

var recipe = {
    name: "default",
    ingredients: "",
    rating: "", 

}

// ================
// Ajax Query
// ================

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    // Extract recipes from Ajax response

    for (var i = 0; i < searchLimit; i++) {
        console.log(response.matches[i]);
        recipe.name = response.matches[i].recipeName;
        // recipe.ingredients = response.matches[i].ingredients;
        // recipe.rating = response.matches[i].rating;

        var result = $("<div>");

        result.addClass("recipeDiv");
        result.attr("id", i);

        result.html(
            `${recipe.name}`
        );

        $(".page__content").append(result);
    }
});

// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
}); 