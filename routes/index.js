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
    .then((profiles) => {
      profiles = camelizeKeys(profiles);
      console.log(profiles);
      let profileArray = [];

      let retrievedLocation = localStorage.getItem('location');
      let locObject = JSON.parse(retrievedLocation);

      let lat1 = locObject.location.lat;
      let lon1 = locObject.location.lng;
      let accuracy = locObject.accuracy;

      profiles.forEach(function(ele, i) {
        let lat2 = profiles[i].lat2;
        let lon2 = profiles[i].lon2;

        var newCard = new CardProfile(profiles[i].imgPath, profiles[i].title,
          lat1, lon1, lat2, lon2, profiles[i].userId);

        newCard.distance = distance(lat1, lon1, lat2, lon2);
        console.log(newCard.distance);

        profileArray.push(newCard);
      });

    });

    res.render('index', {loggedIn: flag});
});

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
