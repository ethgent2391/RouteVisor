function mobile_layout(){
    var viewportWidth = $(window).width();
    if (viewportWidth < 980) {
        $("form").removeClass("col-md-4");
        $("form").addClass("col-md-12");
        $("#start").removeClass("col-md-12 row");
        $("#start").addClass("col-md-5");

        $("#dest").removeClass("col-md-12 row");
        $("#dest").addClass("col-md-5");

        $("#distance").removeClass("col-md-12 row");
        $("#distance").addClass("col-md-5");

        $("#map").removeClass("col-md-8");

        $("#directionsPanel").removeClass("col-md-6");
        $("#directionsPanel").addClass("col-md-12");
    }
}
mobile_layout();

$(document).ready(function () {
    
    // Declare variables
    var map;
    var position;
    var marker;
    var responseObject;
    var tripDistanceInput;
    var infowindow = new google.maps.InfoWindow();
    var request;
    var service;
    var markers = [];

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDdkCpU7scT-GHisDWX3MgHfBBG3oyDmjc",
        authDomain: "trip-planner-1544292860193.firebaseapp.com",
        databaseURL: "https://trip-planner-1544292860193.firebaseio.com",
        projectId: "trip-planner-1544292860193",
        storageBucket: "trip-planner-1544292860193.appspot.com",
        messagingSenderId: "676595493403"
    };
    firebase.initializeApp(config);
    var database = firebase.database();   

    // Define initMap function
    function initMap() {
        // center map
        var center = new google.maps.LatLng(41.093598, -81.4393721);
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: { lat: 41.093598, lng: -81.4393721 },       
            zoom: 4,            
        });
       
        // Initialize Places Service part of the API
        service = new google.maps.places.PlacesService(map);

        // display nearby lodging when user right clicks along the route
        google.maps.event.addListener(map, 'rightclick', function (event) {
            map.setCenter(event.latLng)
            // clearResults(markers)

            var request = {
                location: event.latLng,
                radius: 8000,
                types: ['lodging'],
                title: 'Stop Point!',
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            };
            
            service.nearbySearch(request, callback);
        });

        // Initialize autocomplete
        new AutocompleteDirectionsHandler(map);
    };

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                markers.push(createMarker(results[i]));
            }
        }
    }

    // define function to create markers for waypoints
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: 'Stop Point!',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });

        // when the user clicks a marker, show infoWindow with name, photo, vicinity, and rating
        marker.addListener('click', function () {
            infowindow.open(map, marker);
            infowindow.setContent("<h4 class='marker text-center'>" + place.name + "</h4><img src='" + place.photos[0].getUrl() + "'height='200px' class='img-center' alt='placephoto'><h5 class='marker text-center'>" + place.vicinity +"</h5></n><p class='marker text-center'>Rating: " + place.rating + "/5</p>");
        });
        
        return marker;
    };

    function clearResults(markers) {
        for (var m in markers) {
            markers[m].setMap(null)
        };
        markers = [];
    };

    // run initMap when window loads
    google.maps.event.addDomListener(window, 'load', initMap);
    
    // define AutocompleteDirectionsHandler function
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('start-point');
        var destinationInput = document.getElementById('destination');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, { placeIdOnly: true });
            
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, { placeIdOnly: true });
            console.log(destinationAutocomplete);

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    };

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }
            if (mode === 'ORIG') {
                me.originPlaceId = place.place_id;
            } else {
                me.destinationPlaceId = place.place_id;
            }
            me.route();
        });
    
    };
    
    AutocompleteDirectionsHandler.prototype.route = function () {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var me = this;
    
        this.directionsService.route({
            origin: { 'placeId': this.originPlaceId },
            destination: { 'placeId': this.destinationPlaceId },
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === 'OK') {
                me.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
            responseObject = response;

             // weather api queried and set to display weather based on user's desired end location
            function weathersrch(){
                var weatherinput = response.routes[0].legs[0].end_address
                
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather?q=" + weatherinput +"&APPID=1488d45564a266db9560e76d8c1a9c18",
                method: "GET"
              }).then(function(response) {
                  var kelvin = response.main.temp
                  var celsius = kelvin - 273;
                  var tempf = Math.floor(celsius * (9/5) + 32);
        
                console.log(response);
                $("#weather").html("<h4>Weather in "+ response.name +" right now: </h4><h5>" + response.weather[0].description + "</h5><h4>" + tempf + " degrees</h4>" + "</h4>")
                  coinsole.log(response)
                });
              }

              weathersrch();
            
            console.log(response.request.destination.placeId);

            console.log(responseObject);
            
            instructions = response.routes[0].legs[0].steps.map((step) => step.instructions);
    
            console.log(instructions);

            //writes directions to html
            $("#directionsPanel").prepend(
                `<h4 class="mt-3 row col-md-12">${response.routes[0].legs[0].start_address} to ${response.routes[0].legs[0].end_address}</h4>
                <h5 class="mb-5 mr-2"> Distance: ${response.routes[0].legs[0].distance.text}</h5>
                <h5 class="mb-5 ml-2"> Duration: ${response.routes[0].legs[0].duration.text}</h5>
                <h6 class="displayDirections mt-5"> Directions </h6>`)
    
            for(var i=0; i<instructions.length; i++) {
                $("#ordered-list").append(
                    `<li>${instructions[i]}</li>`
                    )
            };
    });
};


    // on click that will display the waypoints on the route
    $("#submit-button").on("click", function () {

        var stepDistance;
        var totalStepDistance;
        var waypointsArray = [];
        tripDistanceInput = $("#max-travel-dist").val().trim();// user input number of miles to travel before stopping
        tripDistanceInput = parseInt(tripDistanceInput);
        console.log(tripDistanceInput);
        tripIncriment = tripDistanceInput;
        console.log(responseObject);

        var j = 0; // var j is the index of the object step
        stepsArrayLength = responseObject.routes[0].legs[0].steps.length; //length of steps in the route
        stepDistance = responseObject.routes[0].legs[0].steps[j].distance["value"];//the distance value for each step in meters.
        totalTripDistance = responseObject.routes[0].legs[0].distance["value"];// the total distance value in meters from start to destination
        totalTripDistanceMiles = totalTripDistance / 1609.344; // total distance value converted to miles
        stepDistanceMiles = stepDistance / 1609.344;//step distance value converted in miles
        totalStepDistance = 0; //all the steps added up to total distance

        console.log(totalTripDistance);
        console.log(stepDistanceMiles);
        console.log(stepsArrayLength);
        console.log(totalTripDistanceMiles);

        //loops through each step index of the route and adds each leg
        for (i = 0; i < stepsArrayLength; i++) {

            stepDistance = responseObject.routes[0].legs[0].steps[i].distance["value"];//distance in meters for each step of the trip
            stepDistanceMiles = stepDistance / 1609.344; // distance in miles for each step of the trip
            totalStepDistance = totalStepDistance + stepDistanceMiles; //adds each step distance for each index

            //checks to verify if total trip distance is greater than user distance input
            if (totalTripDistanceMiles >= tripDistanceInput) {

                if (totalStepDistance >= tripDistanceInput) {
                    position = responseObject.routes[0].legs[0].steps[i].end_location;

                    // Create a marker and set its position.
                    myLatLng = position;

                     marker = new google.maps.Marker({
                        map: map,
                        position: myLatLng,
                        title: 'Stop Point!'                        

                    });

                    tripDistanceInput = tripDistanceInput + tripIncriment; //add trip max daily distance 
                    waypointsArray.push(myLatLng);
                    console.log(waypointsArray);


                }

                console.log(tripDistanceInput);

            }

            else {

            }

        }

        waypointsArray.forEach(function (latLng) {
            service.nearbySearch({
                location: latLng,
                radius: 8000,
                types: ['lodging']
            }, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        markers.push(createMarker(results[i]));
                    }
                }
            });
        });
        google.maps.event.addDomListener(window, 'load', initMap);

        database.ref().push({


            distance: responseObject.routes[0].legs[0].distance["text"],
            duration: responseObject.routes[0].legs[0].duration["text"]


        });
     
});

})