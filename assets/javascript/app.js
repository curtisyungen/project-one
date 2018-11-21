$(document).on("change", "#search", function () {
    var searchTerm = $(this).val();
});

// ============================================================================================================================
// Yummly API / Ajax
// ============================================================================================================================

// var queryURL = "http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion"

var baseURL = "http://api.yummly.com/v1/api/recipes?_";
var API_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var searchTerm = "green bean casserole";
var searchLimit = 1;             // can be set by user

var queryURL = `${baseURL}app_id=${APP_ID}&_app_key=${API_KEY}&q=${searchTerm}`;

// ================
// Recipe Object
// ================

var recipe = {
    name: "default",
    // rating: 5,
    ingredients: "",
    dietLabels: "",
    image: "",
    // difficulty: 5,
    url: "",
}

// ================
// Ajax Query
// ================

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    console.log(response);

    // Extract recipes from Ajax response

    for (var i = 0; i < searchLimit; i++) {

        // Create div for each recipe

        var resultDiv = $("<div>");

        // Give recipe a class

        resultDiv.addClass("recipeDiv");

        // Give an id to each recipe

        resultDiv.attr("id", i);

        // Add data to recipe object

        recipe.name = response.hits[i].recipe.label;
        recipe.ingredients = response.hits[i].recipe.ingredientLines;
        //recipe.dietLabels = response.hits[i].recipe.dietLabels;
        //recipe.image = response.hits[i].recipe.image;
        //recipe.url = response.hits[i].recipe.url;

        // Add object info to div for display

        resultDiv.html(
            `${recipe.name} <br>
             ${recipe.ingredients} <br>
             ${recipe.image} <br>
             ${recipe.url} <br>`
        );

        // Create image to append to testDiv

        // var testImage = $("<img>");
        // testImage.attr("src", recipe.image);
        // resultDiv.prepend(testImage);

        $(".page__content").append(recipeDiv);

        // Console log the object data

        console.log(response.hits[i].recipe);
    }
});

$(document).on("click", ".recipeDiv", openRecipe);

function openRecipe() {
    console.log("yes");
}

// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
}); 