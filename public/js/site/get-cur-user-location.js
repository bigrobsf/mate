'use strict';
/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint jquery: true */
/* jshint browser: true */

//==============================================================================
// makes the AJAX request to the Google Maps Geolocation API
// function locationRequest() {
//
//   // The object to start the AJAX request using JQuery's format
//   let requestObject = {
//     url: `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAi0kaurEfWwzDKye0ezKEXWhzmZmxEFYI`,
//     method: 'POST',
//     success: saveLocation,
//     error: logError
//   };
//
//   // Actually start the AJAX request
//   return $.ajax(requestObject);

//==============================================================================
// makes location request to the browser's NavigatorGeolocation Web API
function locationRequest() {
  var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 300000 // 5 minutes
  };

  navigator.geolocation.getCurrentPosition(saveLocation, error, options);
}


//==============================================================================
// The event handler for a failed location request
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// function logError(err) {
//   console.log('Get Location Error: ', err);
// }

//==============================================================================
// The event handler for a successful ajax request
function saveLocation(data) {
  console.log('my location: ', data);
  // let lat1 = data.location.lat;
  // let lon1 = data.location.lng;
  // let accuracy = data.accuracy;
  let lat1 = data.coords.latitude;
  let lon1 = data.coords.longitude;
  let accuracy = Math.round(data.coords.accuracy);

  let location = {'lat1': lat1,
                  'lon1': lon1,
                  'accuracy': accuracy};

// sends the current location to the database
  $.ajax({
    type: 'POST',
    url: '/location',
    data: location,
    success: console.log('location save success'),
    error: function(jqXHR, textStatus, err) {
            console.log('save location: ' + textStatus + ', err ' + err);
            }
  });
}

//==============================================================================
// The event handler for a successful location save request
// function saveSuccess(input) {
//   let target = window.location.protocol + '//' + window.location.host;
//   console.log('saveSuccess: ', input, target);
//   window.location = target;
// }
