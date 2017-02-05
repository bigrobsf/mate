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
    flag = true;
  }

  knex.select('photos.user_id', 'image_path', 'lat', 'lon', 'user_name')
    .from('photos')
    .join('profiles', 'photos.user_id', 'profiles.user_id')
    .join('users', 'photos.user_id', 'users.id')
    .where('profile_flag', true)
    .then((rows) => {
      let cardProfiles = camelizeKeys(rows);
      // console.log('from /index', cardProfiles);

      knex.select('lat', 'lon').from('curlocation')
      .then((locs) => {

        let loc;
        let lat1 = 0;
        let lon1 = 0;

        if(locs) {
          loc = locs[0];
          lat1 = loc.lat;
          lon1 = loc.lon;
        }

        let profileArray = [];

        cardProfiles.forEach((ele, i) => {
          let lat2 = cardProfiles[i].lat;
          let lon2 = cardProfiles[i].lon;

          var newCard = new CardProfile(cardProfiles[i].imagePath, cardProfiles[i].userName,
            lat1, lon1, lat2, lon2, cardProfiles[i].userId);

          // delete when distance function fixed
          if (cardProfiles[i].userId !== 1) {
            newCard.distance = Math.floor(Math.random() * 2000);
          }

          // newCard.distance = distance(lat1, lon1, lat2, lon2);
          // console.log(newCard.distance);

          profileArray.push(newCard);
        });

        // console.log('from /index unsorted: ', profileArray);

        profileArray.sort((a, b) => {
          var eleA = a.distance;
          var eleB = b.distance;

          return eleA > eleB ? 1 : eleA < eleB ? -1 : 0;
        });

        console.log('from /index sorted: ', profileArray);

        res.render('index', {loggedIn: flag,
                             profileArray: profileArray
        });
      });
    });
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
      console.log('from /index/location: ',loc);
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
