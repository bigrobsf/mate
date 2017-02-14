/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
'use strict';

const boom  = require('boom');
const express = require('express');
const { camelizeKeys, decamelizeKeys } = require('humps');
var knex = require('../db/knex');
var CardProfile = require('../models/cardprofile.js').CardProfile;
var distance = require('../models/cardprofile.js').distance;

const router = express.Router();

// =============================================================================
// show home page with logged in users
router.get('/', (req, res) => {
  let curUserId = 0;
  let curApp = '';
  let profileArray = [];
  let loggedInFlag = false;

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    curUserId = Number(req.cookies['/token'].split('.')[0]);
    curApp = req.cookies['/token'].split('.')[1];

    // if users session cookie present, make sure user remains logged in
    knex('users')
      .where('id', curUserId)
      .update({logged_in: true})
      .then(() => {});
  }

  knex.select('photos.user_id', 'image_path', 'lat', 'lon', 'user_name')
    .from('photos')
    .join('profiles', 'photos.user_id', 'profiles.user_id')
    .join('users', 'photos.user_id', 'users.id')
    .where('logged_in', true)
    .where('profile_flag', true)
    .then((rows) => {
      let cardProfiles = camelizeKeys(rows);

      // console.log('from /index', cardProfiles);

      knex.select('lat', 'lon', 'accuracy', 'user_name').from('users')
      .where('id', curUserId)
      .then((user) => {
        if (user.length === 1 && curApp === 'mate') {
          let userInfo = camelizeKeys(user[0]);
          let userName = userInfo.userName;
          let lat1 = userInfo.lat;
          let lon1 = userInfo.lon;
          let accuracy = userInfo.accuracy;

          loggedInFlag = true;

          profileArray = createCardProfiles(cardProfiles, lat1, lon1,
            curUserId, profileArray);

          res.render('index', {
            loggedIn: true,
            accuracy: accuracy,
            curUserId: curUserId,
            userName: userName,
            profileArray: profileArray
          });

        } else {

          knex.select('lat', 'lon', 'accuracy').from('curlocation')
          .orderBy('created_at','desc')
          .then((locs) => {

            let loc;
            let lat1 = 0;
            let lon1 = 0;
            let accuracy = 0;

            if (locs.length) {
              loc = locs[0];
              lat1 = loc.lat;
              lon1 = loc.lon;
              accuracy = loc.accuracy;
            }

            profileArray = createCardProfiles(cardProfiles, lat1, lon1, curUserId,
              profileArray);

              res.render('index', {
                loggedIn: false,
                accuracy: accuracy,
                curUserId: 0,
                userName: '',
                profileArray: profileArray
              });
            });
          }
      });
    });
});

// =============================================================================
// store location
router.post('/location', (req, res) => {
  let location = {
    lat: req.body.lat1,
    lon: req.body.lon1,
    accuracy: req.body.accuracy
  };

  let curUserId = 0;
  let curApp = '';
  console.log('in /location route');
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    curUserId = Number(req.cookies['/token'].split('.')[0]);
    curApp = req.cookies['/token'].split('.')[1];

    knex('users')
      .update(decamelizeKeys(location),'*')
      .where('id', curUserId)
      .then((loc) => {
        if (loc.length > 0) {
          delete loc[0].hashed_password;
          console.log('updated users table from /index/location: ',loc);
        }
      });
  } else {

    knex('curlocation')
    .insert(decamelizeKeys(location),
      ['lat', 'lon', 'accuracy'])
    .returning('*')
    .then((row) => {
      const loc = camelizeKeys(row[0]);
       console.log('updated curlocation from /index/location: ',loc);
    })
    .catch((err) => {
      console.log('PUT ERROR: ', err);
    });
  }
});

// =============================================================================
// show about page
router.get('/site/about', (req, res) => {
  res.render('about');
});

// =============================================================================
// show contact page
router.get('/site/contact', (req, res) => {
  res.render('contact');
});

// =============================================================================
// helper function for index route
function createCardProfiles(cardProfiles, lat1, lon1, curUserId, profileArray) {

  cardProfiles.forEach((ele, i) => {
    let lat2 = cardProfiles[i].lat;
    let lon2 = cardProfiles[i].lon;

    var newCard = new CardProfile(cardProfiles[i].imagePath, cardProfiles[i].userName,
      lat1, lon1, lat2, lon2, cardProfiles[i].userId);

      newCard.distance = distance(lat1, lon1, lat2, lon2);
      var d = newCard.distance;

      if (d < 100) {
        newCard.distString = '< 100 feet away';
        newCard.distance = 50;
      }
      else if (d < 1000) newCard.distString += d + ' feet away';
      else if (d < 5200) newCard.distString += (Math.round(d * 100 / 5280) / 100) + ' miles away';
      else if (d >= 5200 && d <= 5400) newCard.distString = '1 mile away';
      else if (d > 5400 && d <= 5 * 5280) newCard.distString += (Math.round(d * 10 / 5280) / 10) + ' miles away';
      else if (d > 5 * 5280) newCard.distString += Math.round(d / 5280) + ' miles away';
      else newCard.distString = 'unavailable';

      if (curUserId === newCard.userId) {
        newCard.distance = 0;
        newCard.distString = '0 feet away';
      }

      profileArray.push(newCard);
  });

  // console.log('from /index unsorted: ', profileArray);

  profileArray.sort((a, b) => {
    var eleA = a.distance;
    var eleB = b.distance;

    return eleA > eleB ? 1 : eleA < eleB ? -1 : 0;
  });

  // console.log('from /index sorted: ', profileArray);

  return profileArray;
}

module.exports = router;
