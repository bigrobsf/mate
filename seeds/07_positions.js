var positions = [{
  id: 1,
  position: 'top'
}, {
  id: 2,
  position: 'bottom'
}, {
  id: 3,
  position: 'versatile'
}, {
  id: 4,
  position: 'oral'
}, {
  id: 5,
  position: 'N/A'
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in positions) {
    	seedPromises.push(knex('positions').insert(positions[index]));
  }
    // Delete all, then run the updates
    return knex('positions').del().then(function() {
        return Promise.all(seedPromises);
  	});
};
