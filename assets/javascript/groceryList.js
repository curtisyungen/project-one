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
    var onsListItem = $("<ons-list-item expandable style='border-bottom: 2px #086DE0 dashed;color: #086DE0;'>");
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

    // Create button to toggle between Image display and Text display
    var displayTypeBtn = createImagesBtn(recipe, "text");
    ingrList.append(displayTypeBtn);

    // Create button to view Recipe Details
    var detailsBtn = createDetailsBtn(recipe);
    ingrList.append(detailsBtn);

    // Create delete button
    var deleteBtn = createDeleteBtn(recipe);
    ingrList.append(deleteBtn);

    onsListItem.append(ingrList);
    $("#groceryList").append(onsListItem);
  }
}

// Creates button for toggling between Text and Image display for ingredient list

function createImagesBtn(recipe, key) {

    // Create View as Images button

    var displayBtn = $("<button>");
    var buttonText;

    if (key == "text") {
      buttonText = "View as Images";
      displayBtn.attr("data-displayType", "text");
    }
    else {
      buttonText = "View as Text";
      displayBtn.attr("data-displayType", "images");
    }

    displayBtn.text(buttonText);
    displayBtn.attr("id", "changeDisplayType");
    displayBtn.attr("data-localStorageId", recipe.localStorageId);
    //console.log(button);

    return displayBtn;
}

// Creates button for accessing Recipe Detail View from Grocery List

function createDetailsBtn(recipe) {

    var detailsButton = $("<button>");
    detailsButton.text("View Details");
    detailsButton.addClass("viewDetails");
    detailsButton.attr("id", recipe.id);

    return detailsButton;
}

// Creates button for deleting individual recipe from Grocery List

function createDeleteBtn(recipe) {

  var deleteButton = $("<button>");
  deleteButton.text("Delete");
  deleteButton.addClass("deleteBtn");
  deleteButton.attr("id", recipe.id);

  return deleteButton;
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselct recipe using button in Recipe Detail View

function removeFromGroceryList(recipe) {

  //console.log(recipe);

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
    ingredient.css("color", "#086DE0");
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
  $(".clipart").detach();

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

$(document).on("tap", ".viewDetails", callGetRecipeDetails); 

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

// =========================================
// DELETE Individual Entry from Grocery List
// =========================================

$(document).on("tap", ".deleteBtn", function(event) {
  event.preventDefault();

  selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var localStorageId;

  for (var i = 0; i < selectedArray.length; i++) {
    if ($(this).attr("id") == selectedArray[i].id) {
      localStorageId = i;
    }
  }

  var deleteRecipe = selectedArray[localStorageId];

  removeFromGroceryList(deleteRecipe);
  
});

