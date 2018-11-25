var queryURL = "https://api.edamam.com/search?q=chicken&app_id=06d1311e&app_key=f04ff3a316728eacadf3124247657efc"

$.ajax({
  url: queryURL,
  method: "GET"
})
  .then(function (response) {
    console.log(response);
  });




$(document).on('click', '#add-item', function () {
  event.preventDefault();
  let userInput = $('#food-input').val().trim();
  let URL = `https://www.googleapis.com/customsearch/v1?q=${userInput}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8`;

  $.ajax({
    url: URL,
    method: 'GET'
  })
    .then(function (response) {

      let thumbnail = $('<img>');
      thumbnail.attr('src', response.items[0].image.thumbnailLink);
      $('#google-api-image').append(thumbnail);
    });
});
