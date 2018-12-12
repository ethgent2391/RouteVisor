$(document).ready(function(){
    var origin = "";
    var destination = "";
    var key = "AIzaSyCFhkxjfneoXB2xv2kVRkO376AHqTXyqzU";
$("#button").on("click", function(){
    origin = $("#start-point").val().trim();
    destination = $("#destination").val().trim();
    var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=" + key;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response);
    })
});
    
});