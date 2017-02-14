var profiles = [{
  id: 1,
  user_id: 1,
  i_am: 'bear',
  i_like: 'muscle',
  birthdate: new Date('1966-06-26 12:26:16 UTC'),
  height: 74,
  weight: 225,
  body_hair: 'hairy',
  ethnicity: 'North European',
  overview: 'at the intersection of gym bro and tech bro',
  looking_for: 'Cliche squid put a bird on it street art selfies semiotics. Copper mug yuccie banjo, shoreditch cardigan scenester sartorial hexagon everyday carry. Put a bird on it pabst meggings, beard iPhone stumptown dreamcatcher banh mi. Portland tumeric four loko copper mug pinterest synth. Aesthetic fap vice 90s, church-key lumbersexual bicycle rights coloring book ramps tote bag semiotics everyday carry literally. Organic kombucha DIY meditation bespoke, banh mi shabby chic kickstarter enamel pin biodiesel direct trade keffiyeh messenger bag flexitarian. Pinterest sartorial woke schlitz, dreamcatcher enamel pin fixie craft beer venmo celiac tote bag cardigan tofu shabby chic.',
  interests: 'science fiction, writing, bodybuilding, software engineering',
  positions: 'top',
  safety: 'PrEP',
  hometown: 'San Francisco',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 2,
  user_id: 2,
  i_am: 'tiger, muscle',
  i_like: 'bear, daddy, muscle, beast',
  birthdate: new Date('1974-11-30 12:26:16 UTC'),
  height: 68,
  weight: 180,
  body_hair: 'hairy',
  ethnicity: 'mixed',
  overview: 'free thinker, writer, organic bodybuilder and golden era fan.',
  looking_for: 'Marfa brunch typewriter, fingerstache bicycle rights cold-pressed sartorial unicorn snackwave tote bag health goth hashtag truffaut sustainable kogi. Viral jianbing prism hoodie skateboard green juice intelligentsia. Tbh food truck hexagon twee. 8-bit echo park viral mixtape etsy. Raw denim meh copper mug hammock. Freegan chicharrones fashion axe, sriracha four dollar toast vape occupy health goth edison bulb. Chillwave tacos fanny pack af crucifix.',
  interests: 'culture, anthropology, bodybuilding, cinema, architecture',
  positions: 'versatile',
  safety: 'condoms',
  hometown: 'San Francisco',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 3,
  user_id: 3,
  i_am: 'daddy, muscle, geek, beast',
  i_like: 'bears, tigers, muscle',
  birthdate: new Date('1951-11-15 12:26:16 UTC'),
  height: 68,
  weight: 250,
  body_hair: 'hairy',
  ethnicity: 'bull',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'top',
  safety: 'ask me',
  hometown: 'Palm Springs',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 4,
  user_id: 4,
  i_am: 'muscle, geek, jock',
  i_like: 'bear, jock, muscle, daddy',
  birthdate: new Date('1974-11-15 12:26:16 UTC'),
  height: 69,
  weight: 220,
  body_hair: 'some hair',
  ethnicity: 'african',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'bottom',
  safety: 'ask me',
  hometown: 'San Francisco',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 5,
  user_id: 5,
  i_am: 'daddy, muscle, geek',
  i_like: 'bear, muscle, daddy',
  birthdate: new Date('1970-11-15 12:26:16 UTC'),
  height: 68,
  weight: 210,
  body_hair: 'some hair',
  ethnicity: 'white',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'versatile',
  safety: 'PrEP',
  hometown: 'Seattle',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 6,
  user_id: 6,
  i_am: 'muscle, beast',
  i_like: 'bear, tiger, muscle',
  birthdate: new Date('1984-11-15 12:26:16 UTC'),
  height: 68,
  weight: 230,
  body_hair: 'hairy',
  ethnicity: 'persian',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'top',
  safety: 'ask me',
  hometown: 'Houston',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 7,
  user_id: 7,
  i_am: 'daddy, muscle, geek',
  i_like: 'daddy, muscle',
  birthdate: new Date('1968-11-15 12:26:16 UTC'),
  height: 68,
  weight: 200,
  body_hair: 'some hair',
  ethnicity: 'german',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'top',
  safety: 'ask me',
  hometown: 'Atlanta',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 8,
  user_id: 8,
  i_am: 'muscle, geek, jock',
  i_like: 'bear, muscle',
  birthdate: new Date('1970-11-15 12:26:16 UTC'),
  height: 70,
  weight: 210,
  body_hair: 'hairy',
  ethnicity: 'chilean',
  overview: 'stuff',
  looking_for: 'more stuff',
  interests: 'even more stuff',
  positions: 'bottom',
  safety: 'ask me',
  hometown: 'Santiago',
  created_at: new Date('2017-01-31 12:26:16 UTC')
}];

exports.seed = function(knex, Promise) {
	var seedPromises = [];

	for (var index in profiles) {
    	seedPromises.push(knex('profiles').insert(profiles[index]));
  }
    // Delete all, then run the updates
    return knex('profiles').del().then(function() {
        return Promise.all(seedPromises);
  	});
};
