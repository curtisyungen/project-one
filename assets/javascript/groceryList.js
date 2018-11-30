// ============================================================================================================================
// GROCERY LIST
// ============================================================================================================================

// ===============================
// ADD items to Grocery List
// ===============================

// This function is called when user chooses SELECT from recipe search results page

function addToGroceryList(recipe) {

  //console.log(recipe);

  if (recipe != "") {

    // Create expandable box
    var onsListItem = $("<ons-list-item expandable style='border-bottom: 2px rgb(8, 109, 224) dashed;color: rgb(8, 109, 224);'>");
    onsListItem.html(`<h4>${recipe.name}</h4><br>`);
    onsListItem.attr("id", recipe.id);

    var ingrList = $("<div>");
    ingrList.addClass("expandable-content");

    // Get list of ingredients and ingredientLines from recipe object
    var ingredients = recipe.ingredients;
    var ingredientLines = recipe.ingredientLines;

    // Create a div for each separate ingredient and add it to container div
    for (var i = 0; i < ingredients.length; i++) {

      var ingr = $("<h5 style='text-align:left;'>");
      ingr.html(ingredientLines[i]);

      ingr.addClass("ingredient");
      ingr.attr("data-crossed", "false");
      
      ingrList.append(ingr);
    }

    // Create View as Images button

    var button = $("<button>");
    button.text("View as Images");
    button.attr("id", "viewAsImages");
    button.attr("data-localStorageId", recipe.localStorageId);
    //console.log(button);

    ingrList.append(button);

    onsListItem.append(ingrList);
    
    // Append container div to grocery list
    $("#groceryList").append(onsListItem);
  }
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselect recipe from search results page

function removeFromGroceryList(recipe) {

  console.log(recipe);

  var selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

  for (var i = 0; i < selectedArray.length; i++) {
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

$(document).on("tap", "#clearGroceryList", function (event) {
  event.preventDefault();

  $("#groceryList").empty();
  localStorage.removeItem("selectedArray");
});

// ======================================
// HIDE ALL Button for Grocery List
// ======================================

const hideAll = () => {
  Array.from(document.querySelector('#groceryList').children)
    .forEach(item => {
      if (item.expanded) {
        item.hideExpansion();
      }
    });
};

// ======================================
// View RECIPE DETAILS from Grocery List
// ======================================

$(document).on("tap", ".ingredientList", callGetRecipeDetails); // need a button

function callGetRecipeDetails() {

  selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var localStorageId;

  for (var i = 0; i < selectedArray.length; i++) {
    if ($(this).attr("id") == selectedArray[i].id) {
      localStorageId = i;
    }
  }

  var selectedRecipe = selectedArray[localStorageId];

  getRecipeDetail(localStorageId, selectedRecipe);
}
