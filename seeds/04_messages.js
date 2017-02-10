var messages = [{
  id: 1,
  user_id1: 1,
  user_id2: 2,
  message: 'Hey',
  created_at: new Date('2017-01-31 18:26:16 UTC'),
  updated_at: new Date('2017-01-31 18:26:16 UTC')
}, {
  id: 2,
  user_id1: 2,
  user_id2: 1,
  message: 'bonjour',
  created_at: new Date('2017-01-31 18:26:56 UTC'),
  updated_at: new Date('2017-01-31 18:26:56 UTC')
}, {
  id: 3,
  user_id1: 2,
  user_id2: 1,
  message: 'nice photos',
  created_at: new Date('2017-01-31 18:27:16 UTC'),
  updated_at: new Date('2017-01-31 18:27:16 UTC')
}, {
  id: 4,
  user_id1: 1,
  user_id2: 2,
  message: 'thanks',
  created_at: new Date('2017-01-31 18:27:19 UTC'),
  updated_at: new Date('2017-01-31 18:27:19 UTC')
}, {
  id: 5,
  user_id1: 1,
  user_id2: 2,
  message: "I've seen you at the gym",
  created_at: new Date('2017-01-31 18:27:26 UTC'),
  updated_at: new Date('2017-01-31 18:27:26 UTC')
}, {
  id: 6,
  user_id1: 2,
  user_id2: 1,
  message: 'me too',
  created_at: new Date('2017-01-31 18:27:30 UTC'),
  updated_at: new Date('2017-01-31 18:27:30 UTC')
}, {
  id: 7,
  user_id1: 2,
  user_id2: 1,
  message: 'want to meet for coffee sometime?',
  created_at: new Date('2017-01-31 18:27:36 UTC'),
  updated_at: new Date('2017-01-31 18:27:36 UTC')
}, {
  id: 8,
  user_id1: 1,
  user_id2: 2,
  message: "I'd like that",
  created_at: new Date('2017-01-31 18:27:40 UTC'),
  updated_at: new Date('2017-01-31 18:27:40 UTC')
}, {
  id: 9,
  user_id1: 2,
  user_id2: 1,
  message: 'cool',
  created_at: new Date('2017-01-31 18:27:46 UTC'),
  updated_at: new Date('2017-01-31 18:27:46 UTC')
}, {
  id: 10,
  user_id1: 2,
  user_id2: 1,
  message: 'how about Saturday afternoon',
  created_at: new Date('2017-01-31 18:28:10 UTC'),
  updated_at: new Date('2017-01-31 18:28:10 UTC')
}, {
  id: 11,
  user_id1: 1,
  user_id2: 2,
  message: 'perfect',
  created_at: new Date('2017-01-31 12:28:16 UTC'),
  updated_at: new Date('2017-01-31 12:28:16 UTC')
}, {
  id: 12,
  user_id1: 1,
  user_id2: 2,
  message: "you know, I can't believe this app. No emojis? really?",
  created_at: new Date('2017-01-31 12:28:30 UTC'),
  updated_at: new Date('2017-01-31 12:28:30 UTC')
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
