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

$(window).on("load", function () {

    selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

    if (selectedArray != null) {

        function generate() {
            for (var i = 0; i < selectedArray.length; i++) {
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

var timerId;

$(document).on("input", "#search", function () {

    clearTimeout(timerId);

    timerId = setTimeout(function() {
        if ($("#search").val() != "") {
            search();
        }
    }, 500);
});

$(document).on("change", ".select", function () {
    search();
});


function search() {

    // Clear search result list

    $("#recipeList").empty();
    recipeArray = [];

    // Get search criteria

    var searchLimit = $("#numResults").val();
    var searchTerm = $("#search").val().trim();
    var cuisine = $("#cuisine").val().trim();
    var diet = $("#diet").val();
    var allergy = $("#allergy").val();

    // ======== SEARCH RECIPE API QUERY ========

    // Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

    var searchRecipeUrl = `https://api.yummly.com/v1/api/recipes?_app_id=${APP_ID}&_app_key=${APP_KEY}&maxResult=${searchLimit}&q=${searchTerm}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedDiet[]=${diet}&allowedAllergy[]=${allergy}`;

    $.ajax({
        url: searchRecipeUrl,
        method: "GET"
    })
        .then(function (response) {
            //console.log(response);

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
                recipeDiv.attr("data-arrayId", recipe.arrayId);
                recipeDiv.html(
                    `<img src=${recipe.smallImgUrl}> 
                    <span>${recipe.name}</span>`
                );

                $("#recipeList").append(recipeDiv);
            }
        });
};

// =========================
// VIEW RECIPE DETAILS
// =========================

//** Event for when user clicks on recipe in search results to view its DETAILS

$(document).on("tap", ".recipeDiv", function () {
    var getArrayId = $(this).attr("data-arrayId");
    var selectedRecipe = recipeArray[getArrayId];

    getRecipeDetail(getArrayId, selectedRecipe);

});

function getRecipeDetail(getArrayId, selectedRecipe) {

    fn.pushPage({ 'id': 'page.html', 'title': 'Recipe Details' });

    // ======== GET RECIPE API QUERY ========

    var getRecipeUrl = `https://api.yummly.com/v1/api/recipe/${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

    $.ajax({
        url: getRecipeUrl,
        method: "GET",
    })
        .then(function (response) {

            //console.log(response);

            // ======== MAKE THIS RECIPE BUTTON ========

            // When recipe is opened, check if it is already in the ingredients list
            selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

            var makeThisRecipe = $("<div>");
            var buttonText;

            makeThisRecipe.addClass("makeThisRecipe");
            makeThisRecipe.attr("data-arrayId", getArrayId);

            buttonText = "Make this Recipe";
            makeThisRecipe.attr("data-text", "make");

            if (selectedArray != null) {
                for (var i = 0; i < selectedArray.length; i++) {
                    if (selectedRecipe.id == selectedArray[i].id) {
                        buttonText = "Added to List";
                        makeThisRecipe.attr("data-text", "added");
                        makeThisRecipe.css("color", "blue");
                        makeThisRecipe.css("background", "lightblue");
                    }
                }
            }

            makeThisRecipe.text(buttonText);

            // ======== LARGER IMAGE ========

            var largeImg = $("<img>");
            largeImg.addClass("recipeDetailImg");
            largeImg.attr("src", response.images[0].hostedLargeUrl);

            // ======== RECIPE NAME ========

            var recipeName = $("<div class='detail' id='detailTitle'>");
            recipeName.html(`<h4>${selectedRecipe.name}</h4>`);

            // ======== RATING ========

            var rating = $("<div class='detail'>");

            for (var i = 0; i < 5; i++) {
                var star = $("<span class='fa fa-star'>");

                if (i < selectedRecipe.rating) {
                    star.addClass("checked");
                }

                rating.append(star);
            }

            // ======== SERVINGS ========

            selectedRecipe.servings = response.numberOfServings;
            var servings = $("<div class='detail'>");
            servings.html(`<h4 class='title'>Servings</h4> ${selectedRecipe.servings}`);

            // ======== INGREDIENTS ========

            var ingredients = $("<div class='detail'>");
            ingredients.html(`<h4 class="title">Ingredients</h4>`);

            for (var i = 0; i < selectedRecipe.ingredients.length; i++) {
                var ingr = $("<div>");
                ingr.text(response.ingredientLines[i]);
                ingredients.append(ingr);
            }

            selectedRecipe.ingredientLines = response.ingredientLines;

            // ======== SOURCE INFO ========

            var sourceDiv = $("<div id='sourceDiv'>");

            var source = $("<a class='source'>");

            source.addClass("detail source");
            source.attr("href", `${response.source.sourceRecipeUrl}`);
            source.text("Link to Recipe Source");
            sourceDiv.append(source);

            selectedRecipe.source = response.source.sourceRecipeUrl;

            // ======== NUTRITION INFO ========

            var nutritionInfo = response.nutritionEstimates;

            var nutritionContainerDiv = $("<div class='detail'>");
            nutritionContainerDiv.addClass("nutritionDiv");

            // Search Terms found in API result (attributes)
            var nutrientArray = ["FAT_KCAL", "SUGAR", "FIBTG", "CHOCDF",
                "VITC", "CA", "PROCNT", "FE"];

            // Labels corresponding to Search Terms
            var labelArray = ["Fat", "Sugar", "Fiber", "Carbs",
                "Vitamin C", "Calcium", "Protein", "Iron"];

            nutritionContainerDiv.html("<h4 class='title'>Nutrition Info</h4>");

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
            var perServing = $("<div id='perServing'>");
            perServing.text("Values shown are per serving");
            nutritionContainerDiv.append(perServing);

            // ======== CREATE RECIPE DETAIL WINDOW ========

            var recipeDetail = $("<div>");
            recipeDetail.addClass("recipeDetail");

            recipeDetail.append(recipeName);
            recipeDetail.append(sourceDiv);
            recipeDetail.append(largeImg);
            recipeDetail.append(rating);
            recipeDetail.append(makeThisRecipe);
            recipeDetail.append(servings);
            recipeDetail.append(ingredients);
            recipeDetail.append(nutritionContainerDiv);

            $('#holder').append(recipeDetail);
        });
}

// =========================
// MAKE THIS RECIPE
// =========================

//** Event for when user clicks MAKE THIS RECIPE

$(document).on("tap", ".makeThisRecipe", function () {

    var selected = $(this);

    // Get the ingredients from the selected recipe

    var getArrayId = $(this).attr("data-arrayId");
    var selectedRecipe = recipeArray[getArrayId];

    //console.log(selectedRecipe);

    // Toggle whether or not a particular recipe is selected or not

    if (selected.attr("data-text") == "added") {
        selected.text("Make This Recipe");
        selected.css("color", "black");
        selected.css("background", "none");
        selected.attr("data-text", "make");

        removeFromGroceryList(selectedRecipe);
    }
    else {
        selected.text("Added to List");
        selected.css("color", "blue");
        selected.css("background", "lightblue");
        selected.attr("data-text", "added");

        if (selectedArray == null) {
            selectedRecipe.localStorageId = 0;
            selectedArray = [selectedRecipe];
        }
        else {
            selectedRecipe.localStorageId = selectedArray.length;
            selectedArray.push(selectedRecipe);
        }

        addToGroceryList(selectedRecipe);

        localStorage.setItem("selectedArray", JSON.stringify(selectedArray));
    }

});

// ============================================================================================================================
// Google Images API
// Google API Documentation: https://developers.google.com/custom-search/docs/overview
// ============================================================================================================================

$(document).on('tap', '#changeDisplayType', function (event) {

    event.preventDefault();

    // Used to target the ingredients' parent div (for appending thumbnail to them)
    let recipeDiv = $(this).parent();

    let localStorageId = $(this).attr("data-localStorageId");
    selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

    let recipe = selectedArray[localStorageId];

    recipeDiv.empty();

    // Key will be used to toggle between "View as Images" and "View as Text"
    var key;

    if ($(this).attr("data-displayType") == "text") {
        key = "images";
        getClipArt(recipe, recipeDiv);
    }
    else {
        key = "text";
        getText(recipe, recipeDiv);
    }

    // Create buttons

    var imagesBtn = createImagesBtn(recipe, key);
    var detailsBtn = createDetailsBtn(recipe);
    var deleteBtn = createDeleteBtn(recipe);

    recipeDiv.append(imagesBtn);
    recipeDiv.append(detailsBtn);
    recipeDiv.append(deleteBtn);

    //console.log(recipeDiv);

});

// This function displays the ingredients in image format

function getClipArt(recipe, recipeDiv) {

    let ingrList = recipe.ingredients;

    let API_KEY = "AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8";

    for (let i = 0; i < ingrList.length; i++) {

        let queryURL = `https://www.googleapis.com/customsearch/v1?q=${ingrList[i]}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=${API_KEY}`;

        $.ajax({
            url: queryURL,
            method: "GET",
        })
            .then(function (response) {

                let thumbnail = $('<img>');
                thumbnail.attr('src', response.items[0].image.thumbnailLink);
                thumbnail.attr('class', 'clipart');
                thumbnail.attr('data-x', 'false');

                thumbnail.css('height', '90px');
                thumbnail.css('width', '85px');
                thumbnail.css('margin', '10px');

                recipeDiv.prepend(thumbnail);
            });
    }
}

// This function displays the ingredients in text format

function getText(recipe, recipeDiv) {
    var ingrList = recipe.ingredientLines;

    for (var i = recipe.ingredients.length; i >= 0; i--) {

        var ingr = $("<h5 style='text-align:left;'>");
        ingr.html(ingrList[i]);

        ingr.addClass("ingredient");
        ingr.attr("data-crossed", "false");

        recipeDiv.prepend(ingr);
    }

}

// Toggles whether or not a clipart image in grocery list is crossed out or not.
// Called when user taps individual image in list.

$(document).on('tap', '.clipart', function () {
    let clipImg = $(this);

    if (clipImg.attr('data-x') == 'false') {
        // clipImg.css("color", "lightgray");
        clipImg.css('opacity', '0.07');
        clipImg.attr("data-x", "true");
    }

    else {
        clipImg.css('opacity', '1.0');
        clipImg.attr('data-x', 'false');
    }
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