var curlocation = [{
  id: 1,
  lat: 37.7841336,
  lon: -122.3957437,
  accuracy: 1084,
  created_at: new Date('2017-01-31 12:26:18 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in curlocation) {
    	seedPromises.push(knex('curlocation').insert(curlocation[index]));
  }
  // Delete all, then run the updates
  return knex('curlocation').del().then(function() {
      return Promise.all(seedPromises);
	});
};
