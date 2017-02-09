'use strict';
/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint jquery: true */
/* jshint browser: true */

// =============================================================================
// card profile class definition - this gets info for showing profiles on index page
var CardProfile = class {
  constructor(imagePath, userName, lat1, lon1, lat2, lon2, userId) {
    this.imagePath = imagePath;
    this.title = userName; // username
    this.lat1 = lat1;
    this.lon1 = lon1;
    this.lat2 = lat2;
    this.lon2 = lon2;
    this.distance = 0;
    this.distString = '';
    this.userId = userId; // userId of selected profile
  }
};

// =============================================================================
// distance

// angles need to be in radians for trig functions
Number.prototype.toRadians = function() {
  return this * Math.PI / 180;
};

/*
  This uses the ‘haversine’ formula to calculate the great-circle distance
  between two points – that is, the shortest distance over the earth’s
  surface. Formula assumes a spherical earth but is accurate enough.

  source: http://www.movable-type.co.uk/scripts/latlong.html
}
*/
var distance = function(lat1, lon1, lat2, lon2) {


  const R = 6371000; // Earth's radius in meters
  let dist = 0;

  lat1 = Number(lat1);
  lat2 = Number(lat2);
  lon1 = Number(lon1);
  lon2 = Number(lon2);

  let latRad1 = lat1.toRadians();
  let latRad2 = lat2.toRadians();
  let deltaLat = (lat2 - lat1).toRadians();
  let deltaLon = (lon2 - lon1).toRadians();

  let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(latRad1) * Math.cos(latRad2) *
          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  dist = R * c * 3.28; // distance in feet

  // if (d < 100) dist = '< 100 feet away';
  // else if (d < 1000) dist += d + ' feet away';
  // else if (d < 5200) dist += (Math.round(d * 100 / 5280) / 100) + ' miles away';
  // else if (d >= 5200 && d <= 5400) dist = '1 mile away';
  // else if (d > 5400 && d <= 5 * 5280) dist += (Math.round(d * 10 / 5280) / 10) + ' miles away';
  // else if (d > 5 * 5280) dist += Math.round(d / 5280) + ' miles away';
  // else dist = 'unavailable';

  return dist;
};

module.exports = {
  CardProfile: CardProfile,
  distance: distance
};
