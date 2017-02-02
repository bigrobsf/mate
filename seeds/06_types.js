var types = [{
  id: 1,
  type: 'bear'
}, {
  id: 2,
  type: 'daddy'
}, {
  id: 3,
  type: 'muscle'
}, {
  id: 4,
  type: 'geek'
}, {
  id: 5,
  type: 'jock'
}, {
  id: 6,
  type: 'beast'
}, {
  id: 7,
  type: 'tiger'
}, {
  id: 8,
  type: 'otter'
}, {
  id: 9,
  type: 'buddy'
}, {
  id: 10,
  type: 'bro'
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in types) {
    	seedPromises.push(knex('types').insert(types[index]));
  }
    // Delete all, then run the updates
    return knex('types').del().then(function() {
        return Promise.all(seedPromises);
  	});
};
