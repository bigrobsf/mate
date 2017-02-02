var safety = [{
  id: 1,
  method: 'PrEP'
}, {
  id: 2,
  method: 'condoms'
}, {
  id: 3,
  method: 'ask me'
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in safety) {
    	seedPromises.push(knex('safety').insert(safety[index]));
  }
    // Delete all, then run the updates
    return knex('safety').del().then(function() {
        return Promise.all(seedPromises);
  	});
};
