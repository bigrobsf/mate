'use strict';
/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint jquery: true */
/* jshint browser: true */

//==============================================================================
// makes the AJAX request to the Google Maps Geolocation API
function locationRequest() {

  // The object we use to start the AJAX request using JQuery's format
  let requestObject = {
    url: `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAi0kaurEfWwzDKye0ezKEXWhzmZmxEFYI`,
    method: "POST",
    success: saveLocation,
    error: logError
  };

  // Actually start the AJAX request
  $.ajax(requestObject);
}

//==============================================================================
// The event handler for a successful ajax request
function saveLocation(data) {
  console.log('my location: ', data);
  let lat1 = data.location.lat;
  let lon1 = data.location.lng;
  let accuracy = data.accuracy;


  let location = {'lat1': lat1,
                  'lon1': lon1,
                  'accuracy': accuracy};

  $.ajax({
    type: 'POST',
    url: '/location',
    data: location,
    success: console.log('success'),
    error: function(jqXHR, textStatus, err) {
            console.log('text status '+textStatus+', err '+err);
            }
  });
}

//==============================================================================
// The event handler for a failed ajax request
function logError(err) {
  console.log('AJAX Error: ', err);
}
