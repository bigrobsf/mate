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
  interests: 'science fiction, bodybuilding, software engineering',
  positions: 'top',
  safety: 'condoms',
  hometown: 'San Francisco',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
}, {
  id: 2,
  user_id: 2,
  i_am: 'tiger',
  i_like: 'bears',
  birthdate: new Date('1974-11-30 12:26:16 UTC'),
  height: 7,
  weight: 180,
  body_hair: 'hairy',
  ethnicity: 'French',
  overview: 'friendly writer, organic bodybuilder, and golden era fan.',
  looking_for: 'Cliche squid put a bird on it street art selfies semiotics.',
  interests: 'culture, anthropology, bodybuilding, architecture',
  positions: 'versatile',
  safety: 'condoms',
  hometown: 'San Francisco',
  created_at: new Date('2017-01-31 12:26:16 UTC'),
  updated_at: new Date('2017-01-31 12:26:16 UTC')
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
