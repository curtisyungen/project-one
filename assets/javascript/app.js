var queryURL = "https://api.edamam.com/search?q=chicken&app_id=06d1311e&app_key=f04ff3a316728eacadf3124247657efc"

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function(response){
        console.log(response);
    });