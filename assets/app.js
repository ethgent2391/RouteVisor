
var map;
var position;
var marker;
var responseObject;
var tripDistanceInput;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: { lat: 41.093598, lng: -81.4393721 },
        zoom: 4

    });


    new AutocompleteDirectionsHandler(map);
}

function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
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
        console.log(responseObject);



    });
};



$("#button").on("click", function () {

    var stepDistance;
    var totalStepDistance;

    tripDistanceInput = 400; // user input number of miles to travel before stopping 
    console.log(responseObject);
    // console.log(response.routes[0].legs[0].steps);

    var j = 0; // var j is the index of the object step
    stepsArrayLength = responseObject.routes[0].legs[0].steps.length; //length of steps in the route
    stepDistance = responseObject.routes[0].legs[0].steps[j].distance["value"];//the distance value for each step in meters.
    totalTripDistance = responseObject.routes[0].legs[0].distance["value"];// the total distance value in meters from start to destination
    totalTripDistanceMiles = totalTripDistance / 1609.344; // total distance value converted to miles
    stepDistanceMiles = stepDistance / 1609.344;//step distance value converted in miles
    totalStepDistance = 0; //all the steps added up to total distance


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
                console.log(position);
                // Create a marker and set its position.
                myLatLng = position;

                var marker = new google.maps.Marker({
                    map: map,
                    position: myLatLng,
                    title: 'Stop Point!'
                });
                console.log(myLatLng);

                break;
            }
        }
        else {

        }

    }

})

