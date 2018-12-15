var map;
var position;
var myLatLng = position;

function initMap() {


    map = new google.maps.Map(document.getElementById("googlemaps"), {
        center: { lat: 41.093598, lng: -81.4393721 },
        zoom: 4
    });
    console.log("Hi");




};

$(document).ready(function () {
    var origin = "";
    var destination = "";
    var key = "AIzaSyCFhkxjfneoXB2xv2kVRkO376AHqTXyqzU";
    var proxy = "https://cors-anywhere.herokuapp.com/";
    $("#button").on("click", function () {
        origin = $("#start-point").val().trim();
        destination = $("#destination").val().trim();
        origin = "Akron"
        destination = "Myrtle Beach"
        var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=" + key;

        $.ajax({
            url: proxy + queryURL,
            method: "GET"
        })
            .then(function (response) {
                var stepDistance;
                var totalStepDistance;

                console.log(response);
                // console.log(response.routes[0].legs[0].steps);

                var j = 0; // var j is the index of the object step
                stepsArrayLength = response.routes[0].legs[0].steps.length; //length of steps in the route
                stepDistance = response.routes[0].legs[0].steps[j].distance["value"];//the distance value for each step in meters.
                totalTripDistance = response.routes[0].legs[0].distance["value"];// the total distance value in meters from start to destination
                totalTripDistanceMiles = totalTripDistance / 1609.344; // total distance value converted to miles
                stepDistanceMiles = stepDistance / 1609.344;//step distance value converted in miles
                totalStepDistance = 0; //all the steps added up to total distance
                tripDistanceInput = 400; // user input number of miles to travel before stopping 

                console.log(stepDistanceMiles);
                console.log(stepsArrayLength);
                console.log(totalTripDistanceMiles);

                //loops through each step index of the route and adds each leg
                for (i = 0; i < stepsArrayLength; i++) {

                    stepDistance = response.routes[0].legs[0].steps[i].distance["value"];//distance in meters for each step of the trip
                    stepDistanceMiles = stepDistance / 1609.344; // distance in miles for each step of the trip
                    totalStepDistance = totalStepDistance + stepDistanceMiles; //adds each step distance for each index

                    // console.log(totalStepDistance);
                    // console.log(i);
                    //checks to verify if total trip distance is greater than user distance input
                    if (totalTripDistanceMiles >= tripDistanceInput) {
                        // console.log("distance is greater than " + tripDistanceInput + " miles");

                        if (totalStepDistance >= tripDistanceInput) {
                            position = response.routes[0].legs[0].steps[i].end_location;
                            console.log(position);
                            myLatLng = position;
                            // Create a marker and set its position.
                            myLatLng = position;
                            var marker = new google.maps.Marker({
                                map: map,
                                position: myLatLng,
                                title: 'Hello World!'
                            });
                            break;
                        }
                    }
                    else {
                        // console.log("distance is less than "+ tripDistanceInput + " miles")
                    }

                }
                // if(totalStepDistance !< tripDistanceInput) {

                // }
            })
    });


});
