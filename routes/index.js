/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
'use strict';

const boom  = require('boom');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
var knex = require('../db/knex');
var CardProfile = require('../models/cardprofile.js').CardProfile;
var distance = require('../models/cardprofile.js').distance;

const router = express.Router();

// =============================================================================
// show home page
router.get('/', function(req, res) {
  let flag = false;

  if (req.cookies['/token']) {
    let flag = true;
  }

  knex.select('photos.user_id', 'image_path', 'lat', 'lon', 'user_name')
    .from('photos')
    .join('profiles', 'photos.user_id', 'profiles.user_id')
    .join('users', 'photos.user_id', 'users.id')
    .where('profile_flag', true)
    .then((rows) => {
      let profiles = camelizeKeys(rows);
      console.log(profiles);

      knex.select('lat', 'lon').from('curlocation')
      .then((locs) => {
        let loc = locs[0];
        let lat1 = loc.lat;
        let lon1 = loc.lon;

        let profileArray = [];

        profiles.forEach(function(ele, i) {
          let lat2 = profiles[i].lat;
          let lon2 = profiles[i].lon;

          console.log('for each', lat2, lon2);

          var newCard = new CardProfile(profiles[i].imgPath, profiles[i].title,
            lat1, lon1, lat2, lon2, profiles[i].userId);

          // newCard.distance = distance(lat1, lon1, lat2, lon2);
          // console.log(newCard.distance);

          profileArray.push(newCard);
        });
      });

    });

    res.render('index', {loggedIn: flag});
});

// =============================================================================
// store location
router.post('/location', function(req, res) {
  let location = {
    lat: req.body.lat1,
    lon: req.body.lon1,
    accuracy: req.body.accuracy
  };

  knex('curlocation')
  .insert(decamelizeKeys(location),
    ['lat', 'lon', 'accuracy'])
  .returning('*')
  .then((row) => {
    const loc = camelizeKeys(row[0]);
      console.log('from request',loc);
  });
});
// .catch((err) => {
//   console.log('PUT ERROR: ', err);
// });

// =============================================================================
// show about page
router.get('/site/about', function(req, res) {
  res.render('about');
});

// =============================================================================
// show contact page
router.get('/site/contact', function(req, res) {
  res.render('contact');
});

module.exports = router;
