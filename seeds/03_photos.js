var photos = [{
  id: 1,
  user_id: 1,
  profile_flag: true,
  image_path: '/images/bigrobsf.jpg',
  caption: 'Where I spend most of my time. Literally.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 2,
  user_id: 2,
  profile_flag: true,
  image_path: '/images/tiger.jpg',
  caption: 'At Lazy Bear in 2016.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 3,
  user_id: 1,
  profile_flag: false,
  image_path: '/images/flex.jpg',
  caption: "It's a start.",
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 4,
  user_id: 1,
  profile_flag: false,
  image_path: '/images/facing-forward.jpg',
  caption: 'Yeah, I like cats.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 5,
  user_id: 1,
  profile_flag: false,
  image_path: '/images/shade.jpg',
  caption: 'A different angle.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 6,
  user_id: 3,
  profile_flag: false,
  image_path: '/images/mike.jpg',
  caption: 'BIG.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 7,
  user_id: 3,
  profile_flag: true,
  image_path: '/images/mike1.jpg',
  caption: 'Working.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 8,
  user_id: 4,
  profile_flag: true,
  image_path: '/images/mitch.jpg',
  caption: 'Better times.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 9,
  user_id: 5,
  profile_flag: true,
  image_path: '/images/derek.jpg',
  caption: 'Hi.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 10,
  user_id: 6,
  profile_flag: true,
  image_path: '/images/keyvon.jpg',
  caption: 'What?',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 11,
  user_id: 7,
  profile_flag: true,
  image_path: '/images/dave.jpg',
  caption: 'Man with beard.',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 12,
  user_id: 8,
  profile_flag: true,
  image_path: '/images/pilotoso.jpg',
  caption: 'Welcome to my office!',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 13,
  user_id: 2,
  profile_flag: false,
  image_path: '/images/tiger2.jpg',
  caption: 'Rawr',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 14,
  user_id: 2,
  profile_flag: false,
  image_path: '/images/tiger3.jpg',
  caption: "We're off to Palm Springs!",
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 15,
  user_id: 9,
  profile_flag: true,
  image_path: '/images/eric.jpg',
  caption: "Get at me dawg",
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 16,
  user_id: 9,
  profile_flag: false,
  image_path: '/images/eric2.jpg',
  caption: "GoREELa",
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 17,
  user_id: 9,
  profile_flag: false,
  image_path: '/images/eric3.jpg',
  caption: "Shades.",
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 18,
  user_id: 10,
  profile_flag: true,
  image_path: 'https://ucarecdn.com/f472de2c-b5fb-49dd-8a4b-b4466e60821b/-/crop/1402x1404/0,153/-/resize/1024x1024/',
  caption: "Add a caption!",
  created_at: new Date('2017-02-18 18:09:40 UTC')
}, {
  id: 19,
  user_id: 10,
  profile_flag: false,
  image_path: 'https://ucarecdn.com/ef427a50-760e-45d4-9e38-2f97622cbed8/-/crop/1536x1536/50,0/-/resize/1024x1024/',
  caption: "Add a caption!",
  created_at: new Date('2017-02-18 18:10:21 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in photos) {
    seedPromises.push(knex('photos').insert(photos[index]));
  }
  // Delete all, then run the updates
  return knex('photos').del().then(function() {
    return Promise.all(seedPromises);
	});
};
