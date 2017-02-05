var users = [{
  id: 1,
  first_name: 'Rob',
  last_name: 'Conner',
  user_name: 'bigrobsf',
  email: 'rjconner@mac.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 2,
  first_name: 'Nicolas',
  last_name: 'Adrien',
  user_name: 'tiger',
  email: 'tiger@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 3,
  first_name: 'Mike',
  last_name: 'Mentzer',
  user_name: 'misteru',
  email: 'mike@misteru.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 4,
  first_name: 'Mitch',
  last_name: 'James',
  user_name: 'mitch',
  email: 'mitch@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 5,
  first_name: 'Derek',
  last_name: 'Smith',
  user_name: 'mixmutt',
  email: 'derek@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 6,
  first_name: 'Keyvon',
  last_name: 'Amir',
  user_name: 'theamir',
  email: 'amir@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 7,
  first_name: 'Dave',
  last_name: 'Johnson',
  user_name: 'dave',
  email: 'dave@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 8,
  first_name: 'Rob',
  last_name: 'Sinclair',
  user_name: 'pilotoso',
  email: 'rob@gmail.com',
  hashed_password: '$2a$12$bRT3lUzJJttX4QPvB4TTU.QnlD9SokVvWKXU1lGPSStcxjztlbM2C',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in users) {
    	seedPromises.push(knex('users').insert(users[index]));
  }
    // Delete all, then run the updates
    return knex('users').del().then(function() {
        return Promise.all(seedPromises);
  	});
};

 // bigger
