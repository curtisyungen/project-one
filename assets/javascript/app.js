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
// Recipe Array
// =========================

var recipeArray = [];

//** Event for when user searches for recipe

$(document).on("change", "#search", function () {

    // Clear search result list

    $("#recipeList").empty();
    recipeArray = [];

    // =========================
    // Search Criteria
    // =========================

    var searchLimit = 10;               // can be set by user
    var searchTerm = $(this).val();

    // =========================
    // SEARCH Recipe API Query
    // =========================

    // Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

    var base_searchRecipeUrl = "https://api.yummly.com/v1/api/recipes?_";
    var searchRecipeUrl = `${base_searchRecipeUrl}app_id=${APP_ID}&_app_key=${APP_KEY}&q=${searchTerm}`;

    $.ajax({
        url: searchRecipeUrl,
        method: "GET"
    })
        .then(function (response) {

            for (var i = 0; i < searchLimit; i++) {

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
                recipeDiv.attr("data-arrayId", recipe.arrayId);
                recipeDiv.html(
                    `<img src=${recipe.smallImgUrl}> 
                 <span>${recipe.name}</span> 
                 <div class="select" data-arrayId=${recipe.arrayId}>Select</div>`
                );

                $("#recipeList").append(recipeDiv);
            }
        });
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
        selected.css("background", "none");
        selected.attr("data-selected", "false");

        removeFromGroceryList(selectedRecipe);
    }
    else {
        selected.text("Selected");
        selected.css("color", "blue");
        selected.css("background", "lightblue");
        selected.attr("data-selected", "true");

        // =========================
        // GET Recipe Ajax Query
        // =========================

        // Get Recipe URL Format: http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY

        var base_getRecipeUrl = "https://api.yummly.com/v1/api/recipe/";
        var getRecipeUrl = `${base_getRecipeUrl}${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

        addToGroceryList(selectedRecipe);
    }

});

//** Event for when user clicks on recipe to view DETAILS

$(document).on("click", ".recipeDiv", function() {
    console.log($(this).attr("class"));
    // Hide search window
    var base_getRecipeUrl = "https://api.yummly.com/v1/api/recipe/";
    var getArrayId = $(this).attr("data-arrayId");
    var selectedRecipe = recipeArray[getArrayId];
    
        var getRecipeUrl = `${base_getRecipeUrl}${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;
        
        $.ajax({
            url: getRecipeUrl,
            method: "GET",
        })
            .then(function (response) {
                
                var source = response.source.sourceRecipeUrl;
                console.log(source);
                var iFrame = `<div id="sourceWebsite">
                            <iframe src=${source} id="source"></iframe>
                        </div>`;
                console.log($(".display").attr("data-display"));
                if ($(".display").attr("data-display") == "visible") {
                    $(".display").attr("data-display", "none");
                }
                $('#holder').append(iFrame);
        
            });
        
    // Open detail view of recipe



});
// ============================================================================================================================
// Google Images API
// Google API Documentation: https://developers.google.com/custom-search/docs/overview
// ============================================================================================================================

$(document).on('click', '#add-item', function(event) {
    event.preventDefault();

    let API_KEY = "AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8";
    let base_googleUrl = "https://www.googleapis.com/customsearch/v1?";
    let userInput = $("#food-input").val().trim();

    let queryURL = `${base_googleUrl}q=${userInput}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=${API_KEY}`;
     
    $.ajax({
      url: queryURL,
      method: "GET", 
    })
      .then(function(response) {
        let thumbnail = $('<img>');
        thumbnail.attr('src', response.items[0].image.thumbnailLink);
        $('#google-api-image').append(thumbnail);
      });
  });

// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

window.fn = {};

window.fn.pushPage = function (page, anim) {
    if (anim) {
        // document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Page 2'}});

        document.getElementById('myNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
    } else {

        // page.querySelector('ons-toolbar .center').innerHTML = page.data.title;

        document.getElementById('myNavigator').pushPage(page.id, { data: { title: page.title } });
    }
};

$(document).on("click",".recipeDiv",function(){
    // window.location.href='tab2.html';
    fn.pushPage({'id': 'page.html', 'title': 'Ingredients'});
    
 });
