// ============================================================================================================================
// GROCERY LIST
// ============================================================================================================================

// ===============================
// ADD items to Grocery List
// ===============================

// This function is called when user chooses SELECT from recipe search results page

function addToGroceryList(recipe) {

  //console.log(recipe);

  // Get list of ingredients from recipe object
  var ingredients = recipe.ingredients;

  // Create container div for ingredients. Give it same id as recipe
  var ingrList = $("<div>");
  ingrList.addClass("ingredientList");
  ingrList.attr("id", recipe.id);

  // Add recipe title to grocery list
  ingrList.html(`<h4><a href=${recipe.source}>${recipe.name}</a></h4><br>`);

  // Create a div for each separate ingredient and add it to container div
  for (var i = 0; i < ingredients.length; i++) {

    var ingr = $("<div>");

    ingr.text(ingredients[i]);
    ingr.addClass("ingredient");
    ingr.attr("data-crossed", "false");

    ingrList.append(ingr);

  }

  // Append container div to grocery list
  $("#groceryList").append(ingrList);
}

// ===============================
// REMOVE items from Grocery List
// ===============================

// This function is called when user chooses to deselect recipe from search results page

function removeFromGroceryList(recipe) {

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