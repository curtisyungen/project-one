// ============================================================================================================================
// Edamam API
// ============================================================================================================================
$(document).on("change", '#search', function(){
    var search = $(this).val();
    
    // var queryURL = "https://api.edamam.com/search?app_id=06d1311e&app_key=f04ff3a316728eacadf3124247657efc&q=" + search;

    var baseURL = "https://api.edamam.com/search?";
    var API_KEY = "app_key=f04ff3a316728eacadf3124247657efc";
    var APP_ID = "app_id=06d1311e";
    var searchTerm = $(this).val();  
    var searchLimit = 10;             /* Can be set by user. Default = 10 */

    // Set up recipe object
    var recipe = {
        name: "default",
        rating: 5,
        ingredients: "",
        difficulty: 5,
    }

  var queryURL = `${baseURL}${APP_ID}&${API_KEY}&q=${searchTerm}`;

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        for (var i=0; i<searchLimit; i++) {

            console.log(response.hits[i].recipe.label);
    
        }    ;
    });
})



// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================
document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});