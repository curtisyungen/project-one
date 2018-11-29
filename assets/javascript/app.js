// =========================
// GLOBAL VARIABLES
// =========================
var APP_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var recipeArray = [];
var selectedArray;

// ============================================================================================================================
// Yummly APIs: Search Recipe API, Get Recipe API
// Yummly API Documentation: https://developer.yummly.com/documentation
// ============================================================================================================================

// =========================
// LOCAL STORAGE
// =========================

$(window).on("load", function() {

    selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

    if (selectedArray != null) {

        function generate() {
            for(var i=0; i<selectedArray.length; i++){
                addToGroceryList(selectedArray[i]);
            }
        }
        
        setTimeout(generate, 100);
    }
});

// =========================
// SEARCH RECIPE
// =========================

//** Event for when user searches for recipe

$(document).on("change", "#search", function () {

    // Clear search result list

    $("#recipeList").empty();
    recipeArray = [];

    // Get search criteria

    var searchLimit = $("#numResults").val();
    var searchTerm = $(this).val();

// ======== SEARCH RECIPE API QUERY ========

    // Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

    var searchRecipeUrl = `https://api.yummly.com/v1/api/recipes?_app_id=${APP_ID}&_app_key=${APP_KEY}&maxResult=${searchLimit}&q=${searchTerm}`;

    $.ajax({
        url: searchRecipeUrl,
        method: "GET"
    })
    .then(function (response) {
        console.log(response);

        for (var i = 0; i < searchLimit; i++) {

            var recipe = {
                name: "",
                id: "",
                arrayId: "",
                ingredients: [],
                rating: "",
                smallImgUrl: "",
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

            var subDiv = $("<div>");
            subDiv.addClass("subDiv");
            subDiv.attr("data-arrayId", recipe.arrayId);
            subDiv.html(
                `<img src=${recipe.smallImgUrl}> 
                <span>${recipe.name}</span>`
            );

            recipeDiv.append(subDiv);
            var selectDiv = $("<div>");

            selectDiv.addClass("select");
            selectDiv.attr("data-arrayId", recipe.arrayId);
            selectDiv.text("Select");

            recipeDiv.append(selectDiv);

            $("#recipeList").append(recipeDiv);
        }
    });
});

// =========================
// SELECT RECIPE
// =========================

//** Event for when user clicks SELECT, indicating an intent to make this recipe

$(document).on("tap", ".select", function () {

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

        addToGroceryList(selectedRecipe);

        if (selectedArray == null) {
            selectedArray = [selectedRecipe];
        }
        else {
            selectedArray.push(selectedRecipe);
        }

        localStorage.setItem("selectedArray", JSON.stringify(selectedArray));
    }
});

// =========================
// VIEW RECIPE DETAILS
// =========================

//** Event for when user clicks on recipe in search results to view its DETAILS

$(document).on("tap", ".subDiv", function () {

// ======== GET RECIPE API QUERY ========

    var getArrayId = $(this).attr("data-arrayId");
    var selectedRecipe = recipeArray[getArrayId];

    var getRecipeUrl = `https://api.yummly.com/v1/api/recipe/${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

    $.ajax({
        url: getRecipeUrl,
        method: "GET",
    })
    .then(function (response) {

        //console.log(response);

        // ======== LARGER IMAGE ========

        var largeImg = $("<img>");
        largeImg.addClass("recipeDetailImg");
        largeImg.attr("src", response.images[0].hostedLargeUrl);

        // ======== RECIPE NAME ========

        var recipeName = $("<div>");
        recipeName.html(`<h4>${selectedRecipe.name}</h4>`);

        // ======== RATING ========

        var rating = $("<div>");
        rating.html(`<h4>Rating:</h4> ${selectedRecipe.rating}`);

        // ======== INGREDIENTS ========

        var ingredients = $("<div>");
        ingredients.html(`<h4>Ingredients:</h4><br>${selectedRecipe.ingredients}`);

        // ======== SOURCE INFO ========

        var source = $("<div>");
        source.html(`<h4>Source:</h4> ${response.source.sourceRecipeUrl}`);
        selectedRecipe.source = response.source.sourceRecipeUrl;

        // ======== NUTRITION INFO ========

        var nutritionInfo = response.nutritionEstimates;

        var nutritionContainerDiv = $("<div>");
        nutritionContainerDiv.addClass("nutritionDiv");

        // Search Terms found in API result (attributes)
        var nutrientArray = ["FAT_KCAL", "SUGAR", "FIBTG", "CHOCDF",
            "VITC", "CA", "PROCNT", "FE"];

        // Labels corresponding to Search Terms
        var labelArray = ["Fat", "Sugar", "Fiber", "Carbs",
            "Vitamin C", "Calcium", "Protein", "Iron"];

        nutritionContainerDiv.html("<h4>Nutrition Info: </h4>");

        // Loop through all elements in nutrition info (usually 50+ of them)
        for (var i = 0; i < nutritionInfo.length; i++) {
            var label = response.nutritionEstimates[i].attribute;

            // Look for element attribute names that match with the labels we're looking for (shown in nutrientArray)
            for (var j = 0; j < nutrientArray.length; j++) {

                // If match found, compile and append to nutrition list
                if (label == nutrientArray[j]) {

                    var nutr = $("<div>");

                    var newLabel = labelArray[j];
                    var nutrVal = response.nutritionEstimates[i].value;
                    var nutrUnit = response.nutritionEstimates[i].unit.plural;

                    nutr.text(`${newLabel}: ${nutrVal} ${nutrUnit}`);

                    nutritionContainerDiv.append(nutr);
                }
            }
        }

        // ======== CREATE RECIPE DETAIL WINDOW ========
        
        var recipeDetail = $("<div>");
        recipeDetail.addClass("recipeDetail");

        recipeDetail.append(largeImg);
        recipeDetail.append(recipeName);
        recipeDetail.append(rating);
        recipeDetail.append(ingredients);
        recipeDetail.append(source);
        recipeDetail.append(nutritionContainerDiv);

        $('#holder').append(recipeDetail);

    });
});

// ============================================================================================================================
// Google Images API
// Google API Documentation: https://developers.google.com/custom-search/docs/overview
// ============================================================================================================================

$(document).on('tap', '#add-item', function (event) {
    event.preventDefault();

// ======== GOOGLE IMAGE (CLIPART) API QUERY ========

    let API_KEY = "AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8";
    let userInput = $("#food-input").val().trim();

    let queryURL = `https://www.googleapis.com/customsearch/v1?q=${userInput}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=${API_KEY}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function (response) {
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

// ============================================================================================================================
// PushPage: View Recipe Details  
// ============================================================================================================================

window.fn = {};

window.fn.pushPage = function (page, anim) {
    if (anim) {

        // document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Page 2'}});
        document.getElementById('myNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
    }
    else {

        // page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        document.getElementById('myNavigator').pushPage(page.id, { data: { title: page.title } });
    }
};

//** Event that opens recipe detail view when recipe is tapped

$(document).on("tap", ".subDiv", function() {

    // window.location.href='tab2.html';
    fn.pushPage({ 'id': 'page.html', 'title': 'Recipe Details' });

});