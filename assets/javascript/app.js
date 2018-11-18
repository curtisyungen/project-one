// ============================================================================================================================
// Edamam API
// ============================================================================================================================
$(document).on("change", '#search', function(){
    var search = $(this).val();
    
    var queryURL = "https://api.edamam.com/search?app_id=06d1311e&app_key=f04ff3a316728eacadf3124247657efc&q=" + search;

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        console.log(response);
    });
})



// ============================================================================================================================
// Onsen UI    
// ============================================================================================================================
document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});