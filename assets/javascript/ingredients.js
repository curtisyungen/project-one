// ============================================================================================================================
// Ingredients
// ============================================================================================================================

// This function is called when user chooses recipe to make

function addToGroceryList(recipe) {

  var ingredients = recipe.ingredients;
  var ingrList = $("<div>");
  ingrList.addClass("ingredientList");
  ingrList.attr("id", recipe.id);
  
  for (var i=0; i<ingredients.length; i++) {

    var ingr = $("<div>");

    ingr.text(ingredients[i]);
    ingr.addClass("ingredient");
    ingr.attr("data-crossed", "false");

    ingrList.append(ingr);
    
  }

  $("#groceryList").append(ingrList);
}

// This function removes the ingredients for a specific recipe from the grocery list

function removeFromGroceryList(recipe) {

  $(`#${recipe.id}`).remove();

}

// Listen for if ingredient is tapped

$(document).on("click", ".ingredient", crossOffList);

// When tapped, toggle cross/uncross for subject ingredient

function crossOffList() {

  var ingredient = $(this);

  // If ingredient not yet crossed off, cross it off list
  if (ingredient.attr("data-crossed") == "false") {
    ingredient.css("text-decoration", "line-through");
    ingredient.attr("data-crossed", "true");
  }

  // If ingredient already crossed off, uncross it
  else {
    ingredient.css("text-decoration", "none");
    ingredient.attr("data-crossed", "false");
  }
}