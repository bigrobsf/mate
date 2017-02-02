var messages = [{
  id: 1,
  conversation_id: 1,
  user_id: 1,
  message: "how's it going?",
  created_at: new Date('2017-01-31 12:26:18 UTC')
}, {
  id: 2,
  conversation_id: 1,
  user_id: 2,
  message: "hey nice photos!",
  created_at: new Date('2017-01-31 12:26:45 UTC')
}, {
  id: 3,
  conversation_id: 1,
  user_id: 2,
  message: "what are you up to today?",
  created_at: new Date('2017-01-31 12:26:59 UTC')
}, {
  id: 4,
  conversation_id: 1,
  user_id: 1,
  message: "wondering if you'd like to meet for coffee",
  created_at: new Date('2017-01-31 12:27:15 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in messages) {
    	seedPromises.push(knex('messages').insert(messages[index]));
  }
  // Delete all, then run the updates
  return knex('messages').del().then(function() {
      return Promise.all(seedPromises);
	});
};
