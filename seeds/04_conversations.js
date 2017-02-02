var conversations = [{
  id: 1,
  initiator_id: 1,
  recipient_id: 2,
  created_at: new Date('2017-01-31 12:26:16 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in conversations) {
    	seedPromises.push(knex('conversations').insert(conversations[index]));
  }
  // Delete all, then run the updates
  return knex('conversations').del().then(function() {
      return Promise.all(seedPromises);
  });
};
