// ============================================================================================================================
// GROCERY LIST
// ============================================================================================================================

// ===============================
// ADD items to Grocery List
// ===============================

// This function is called when user chooses SELECT from recipe search results page

function addToGroceryList(recipe) {

  if (recipe != "") {

    //console.log(recipe);

    // Get list of ingredients and ingredientLines from recipe object
    var ingredients = recipe.ingredients;
    var ingredientLines = recipe.ingredientLines;

    // Create container div for ingredients. Give it same id as recipe
    var ingrList = $("<div>");
    ingrList.addClass("ingredientList");
    ingrList.attr("id", recipe.id);

    // Add recipe title to grocery list
    ingrList.html(`<h4>${recipe.name}</h4><br>`);

    // Create a div for each separate ingredient and add it to container div
    for (var i = 0; i < ingredients.length; i++) {

      var ingr = $("<div>");

      ingr.html(`${ingredientLines[i]}`);
      ingr.addClass("ingredient");
      ingr.attr("data-crossed", "false");

      ingrList.append(ingr);

    }

    // Append container div to grocery list
    $("#groceryList").append(ingrList);

    // Add 'view ingredients as images' button
    var button = $("<button>");

    button.text("View as Images");
    button.attr("id", "viewAsImages");

    $("#groceryList").append(button);
  }
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselect recipe from search results page

function removeFromGroceryList(recipe) {

  console.log(recipe);

  var selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

  for (var i=0; i<selectedArray.length; i++) {
    if (selectedArray[i].id == recipe.id) {
      selectedArray[i] = "";
    }
  }

  localStorage.setItem("selectedArray", JSON.stringify(selectedArray));

  $(`#${recipe.id}`).remove();

}

// ===============================
// Grocery List Functionality
// ===============================

//** Event listener for when an ingredient is tapped by user

$(document).on("tap", ".ingredient", crossOffList);

// This function toggles whether or not an item in grocery list is crossed out or not.
// Called when user taps individual item in list.

function crossOffList() {

  var ingredient = $(this);

  // If ingredient not yet crossed off, cross it off list
  if (ingredient.attr("data-crossed") == "false") {
    ingredient.css("color", "lightgray");
    ingredient.css("text-decoration", "line-through");
    ingredient.attr("data-crossed", "true");
  }

  // If ingredient already crossed off, uncross it
  else {
    ingredient.css("color", "black");
    ingredient.css("text-decoration", "none");
    ingredient.attr("data-crossed", "false");
  }
}

// ===============================
// CLEAR Grocery List
// ===============================

$(document).on("click", "#clearGroceryList", function(event) {
  event.preventDefault();

  $("#groceryList").empty();
  localStorage.removeItem("selectedArray");
});

// ============================================================================================================================
// Google Images API
// Google API Documentation: https://developers.google.com/custom-search/docs/overview
// ============================================================================================================================

$(document).on('tap', '#viewAsImages', function(event) {
  event.preventDefault();

  let API_KEY = "AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8";
  let base_googleUrl = "https://www.googleapis.com/customsearch/v1?";
  
  for (let i = 3; i < $(this).parent()[0].childNodes.length; i++) {
    let queryURL = `${base_googleUrl}q=${ingredToImg}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=${API_KEY}`;
    var ingredToImg = $(this).parent()[0].childNodes[i].innerHTML;
       
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function (response) {
      let thumbnail = $('<img>');
      thumbnail.attr('src', response.items[0].image.thumbnailLink);
      $('h4').prepend(thumbnail);
      // ingredToImg = thumbnail;
    });
              
    // var something = $(this).parent()[0].childNodes[3].innerHTML;
    // let thumbnail = $('<img>');
    // thumbnail.attr('src', response.items[0].image.thumbnailLink);
    // $('#google-api-image').append(thumbnail);
  }

});

$(document).on("tap", ".ingredientList", callFunction);

function callFunction() {

  selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var localStorageId;

  for (var i=0; i<selectedArray.length; i++) {
    if ($(this).attr("id") == selectedArray[i].id) {
      localStorageId = i;
    }
  }

  var selectedRecipe = selectedArray[localStorageId];

  getRecipeDetail(localStorageId, selectedRecipe);
}