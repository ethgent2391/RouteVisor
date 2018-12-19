$(document).ready(function () {

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

var map;
var position;
var marker;
var responseObject;
var tripDistanceInput;
var infowindow = new google.maps.InfoWindow();
var instructions;

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

function initMap() {
    var center = new google.maps.LatLng(41.093598, -81.4393721);
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: { lat: 41.093598, lng: -81.4393721 },
        zoom: 4



    function initMap() {
        var center = new google.maps.LatLng(41.093598, -81.4393721);
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: { lat: 41.093598, lng: -81.4393721 },
            
            zoom: 4,
            
        });
       
        service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);

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
        })

        new AutocompleteDirectionsHandler(map);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                markers.push(createMarker(results[i]));
            }
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: 'Stop Point!',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

        });
        marker.addListener('click', function () {
            infowindow.open(map, marker);
            infowindow.setContent(place.name);
        })
        return marker;
    }

    function clearResults(markers) {
        for (var m in markers) {
            markers[m].setMap(null)
        }
        markers = [];
    }

    google.maps.event.addDomListener(window, 'load', initMap);
    

    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('start-point');
        var destinationInput = document.getElementById('destination');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, { placeIdOnly: true });
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, { placeIdOnly: true });

        // this.setupClickListener('changemode-walking', 'WALKING');
        // this.setupClickListener('changemode-transit', 'TRANSIT');
        // this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    }

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function () {
            me.travelMode = mode;
            me.route();
        });
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
        responseObject = response;
        console.log(responseObject);
        
        instructions = response.routes[0].legs[0].steps.map((step) => step.instructions);
        debugger;
        for(var i=0; i<instructions.length; i++) {
            $("#directionsPanel").append(instructions[i]);
        };
    });
};



$("#submit-button").on("click", function () {

        var stepDistance;
        var totalStepDistance;
        var waypointsArray = [];
        tripDistanceInput = $("#max-travel-dist").val().trim();// user input number of miles to travel before stopping
        tripDistanceInput = parseInt(tripDistanceInput);
        console.log(tripDistanceInput);
        tripIncriment = tripDistanceInput;
        console.log(responseObject);
        // console.log(response.routes[0].legs[0].steps);

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

            // console.log(totalStepDistance);
            // console.log(i);

            //checks to verify if total trip distance is greater than user distance input
            if (totalTripDistanceMiles >= tripDistanceInput) {
                // console.log("distance is greater than " + tripDistanceInput + " miles");

                if (totalStepDistance >= tripDistanceInput) {
                    position = responseObject.routes[0].legs[0].steps[i].end_location;

                    // Create a marker and set its position.
                    myLatLng = position;

                     marker = new google.maps.Marker({
                        map: map,
                        position: myLatLng,
                        title: 'Stop Point!'                        

                    });
                    // console.log(responseObject.routes[0].legs[0].steps[i]);
                    // console.log(myLatLng);
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

// routes[0].legs[0].steps[i].instructions
