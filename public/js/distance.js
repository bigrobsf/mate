/* jshint esversion: 6 */

const R = 6371000; // Earth's radius in meters

// angles need to be in radians for trig functions
Number.prototype.toRadians = function() {
  return this * Math.PI / 180;
};

/*
  This uses the ‘haversine’ formula to calculate the great-circle distance
  between two points – that is, the shortest distance over the earth’s
  surface.

  Formula assumes a spherical earth but is accurate enough for our purpose.

  source: http://www.movable-type.co.uk/scripts/latlong.html
}
*/
function distance(lat1, lon1, lat2, lon2) {
  let dist = '';

  let latRad1 = lat1.toRadians();
  let latRad2 = lat2.toRadians();
  let deltaLat = (lat2 - lat1).toRadians();
  let deltaLon = (lon2 - lon1).toRadians();

  let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(latRad1) * Math.cos(latRad2) *
          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let d = R * c * 3.28; // distance apart in feet

  if (d < 100) dist = '< 100 feet away';
  else if (d < 1000) dist += d + ' feet away';
  else if (d < 5200) dist += (Math.round(d * 100 / 5280) / 100) + ' miles away';
  else if (d >= 5200 && d <= 5400) dist = '1 mile away';
  else if (d > 5400 && d <= 5 * 5280) dist += (Math.round(d * 10 / 5280) / 10) + ' miles away';
  else if (d > 5 * 5280) dist += Math.round(d / 5280) + ' miles away';
  else dist = 'unavailable';

  return dist;
}

console.log(distance(40.7486, -73.9864, 30.1234, -120));

module.exports = {
  distance: distance
};