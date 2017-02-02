var photos = [{
  id: 1,
  user_id: 1,
  profile_flag: true,
  image_path: '/public/images/bigrobsf.jpg',
  caption: 'Where I spend most of my time. literally.',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 2,
  user_id: 2,
  profile_flag: true,
  image_path: '/public/images/tiger.jpg',
  caption: 'At Lazy Bear in 2016.',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 3,
  user_id: 1,
  profile_flag: false,
  image_path: '/public/images/flex.jpg',
  caption: "It's a start.",
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 4,
  user_id: 1,
  profile_flag: false,
  image_path: '/public/images/facing_forward.jpg',
  caption: 'Yeah, I like cats.',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 5,
  user_id: 1,
  profile_flag: false,
  image_path: '/public/images/shade.jpg',
  caption: 'A different angle.',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
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
