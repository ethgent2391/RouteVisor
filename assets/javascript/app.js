var map;
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('googlemaps'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start-point').addEventListener('change', onChangeHandler);
    document.getElementById('destination').addEventListener('change', onChangeHandler);
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: document.getElementById('start-point').value,
      destination: document.getElementById('destination').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

$(document).ready(function(){
    var origin = "";
    var destination = "";
    var key = "AIzaSyCFhkxjfneoXB2xv2kVRkO376AHqTXyqzU";
    var proxy = "https://cors-anywhere.herokuapp.com/";
    $("#button").on("click", function(){
        origin = $("#start-point").val().trim();
        destination = $("#destination").val().trim();
        var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&key="+key;

        $.ajax({
            url: proxy + queryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);
        })
    });
});
