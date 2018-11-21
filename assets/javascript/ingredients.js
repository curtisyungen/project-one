// ============================================================================================================================
// Ingredients
// ============================================================================================================================

// This function is called when user chooses recipe to make

function addToGroceryList(recipe) {

  var ingredientList = recipe.ingredients;
  
  for (var i=0; i<ingredientList.length; i++) {
    var ingredient = $("<div>");
    ingredient.addClass("ingredient");

    ingredient.html(
      `${ingredientList[i]}`,
    );

    $("#Tab2 .page__content").append(ingredient); // Rename this ID later
  }  
}