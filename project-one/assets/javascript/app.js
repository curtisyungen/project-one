// Set up Ajax search data

var baseURL = "https://api.edamam.com/search?q=";
var API_KEY = "f04ff3a316728eacadf3124247657efc";
var APP_ID = "app_id=06d1311e";

var searchTerm = "green bean casserole";
var searchLimit = 10;             /* Can be set by user. Default = 10 */

var queryURL = `${baseURL}${searchTerm}&${APP_ID}&app_key=${API_KEY}`;

// Set up recipe object

var recipe = {
    name: "default",
    rating: 5,
    ingredients: "",
    difficulty: 5,
}

// Make Ajax Query

$.ajax({
    url: queryURL,
    method: "GET"
})

.then(function(response){

    // Extract recipes from Ajax response

    for (var i=0; i<searchLimit; i++) {

        console.log(response.hits[i].recipe.label);

    }    
});