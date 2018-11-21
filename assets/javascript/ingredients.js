// ============================================================================================================================
// Ingredients
// ============================================================================================================================

// This function is called when user chooses recipe to make

function addToGroceryList(recipe) {

  var ingredientList = recipe.ingredients;
  
  for (var i=0; i<ingredientList.length; i++) {
    var ingredient = $("<div>");
    ingredient.addClass("ingredient");
    ingredient.attr("data-crossed", "false");

    ingredient.html(
      `${ingredientList[i]}`,
    );

    $("#Tab2 .page__content").append(ingredient); // Rename this ID later
  }  
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