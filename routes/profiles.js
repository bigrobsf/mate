/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

const express = require('express');
var knex = require('../db/knex');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
const router = express.Router();

// =============================================================================
// function to concatenate multiple selections from form input into a string
function concatSelected(array) {
  if (typeof array === 'object') {
    let result = '';

    for (var i = 0; i < array.length; i++) {
      if (i !== array.length - 1) result = result + array[i] + ', ';
      else result = result + array[i];
    }

    return result;
  } else return array;
}

// =============================================================================
// function to return a friendly date format
function formatDate(rawDate) {
  let format = { year: 'numeric', month: 'long', day: 'numeric' };
  let date = new Date(rawDate);

  return date.toLocaleDateString('en-US', format);
}

// =============================================================================
// show input form for new profile
router.get('/new', (req, res) => {
  console.log('COOKIE: ', req.cookies);
  if (req.cookies['/token']) {
    let userId = Number(req.cookies['/token'].split('.')[0]);
    console.log(userId);
    // check to see if profile already exists or not
    knex.select('id').from('profiles')
      .where('user_id', userId).first()
      .then((exist) => {
        if (!exist) res.render('make-profile');
        else res.redirect('/profiles/update');
        // else res.render('edit-profile');
      });

  } else {
    res.redirect('../token/login');
  }
});

// =============================================================================
// POST new profile
router.post('/', (req, res) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);

  let allIAms = concatSelected(req.body.iAm);
  let allILikes = concatSelected(req.body.iLike);
  let allPositions = concatSelected(req.body.positions);
  let allMethods = concatSelected(req.body.methods);

  let newProfile = {
    userId: userId,
    iAm: allIAms,
    iLike: allILikes,
    birthdate: req.body.birthdate,
    height: Number(req.body.height),
    weight: Number(req.body.weight),
    bodyHair: req.body.bodyHair,
    ethnicity: req.body.ethnicity,
    overview: req.body.overview,
    lookingFor: req.body.lookingFor,
    interests: req.body.interests,
    positions: allPositions,
    safety: allMethods,
    hometown: req.body.hometown
  };

  knex('profiles')
  .insert(decamelizeKeys(newProfile),
    ['id', 'user_id', 'i_am', 'i_like', 'birthdate', 'height', 'weight',
    'body_hair', 'ethnicity', 'overview', 'looking_for', 'interests',
    'positions', 'safety', 'hometown'])
    .returning('*')
    .then((row) => {
      const profile = camelizeKeys(row[0]);
      let formattedDate = formatDate(profile.birthdate);

      res.render('confirm-profile', {iAm: profile.iAm,
                                iLike: profile.iLike,
                                birthdate: formattedDate,
                                height: profile.height,
                                weight: profile.weight,
                                bodyHair: profile.bodyHair,
                                ethnicity: profile.ethnicity,
                                overview: profile.overview,
                                lookingFor: profile.lookingFor,
                                interests: profile.interests,
                                positions: profile.positions,
                                safety: profile.safety,
                                hometown: profile.hometown,
                                status: 'Added'});
    }).catch(err => {
      console.log('POST ERROR: ', err);
      res.status(400).send(err);
  });
});

// =============================================================================
// show profile update page for current user
router.get('/update', (req, res) => {

  if (req.cookies['/token']) {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('user_name', 'user_id', 'i_am', 'i_like', 'birthdate', 'height', 'weight',
    'body_hair', 'ethnicity', 'overview', 'looking_for', 'interests',
    'positions', 'safety', 'hometown')
      .from('users')
      .join('profiles', 'users.id', 'profiles.user_id')
      .where('users.id', userId)
      .then((profile) => {
        profile = camelizeKeys(profile[0]);

        let formattedDate = formatDate(profile.birthdate);

        if (profile) {
          res.render('edit-profile', {userName: profile.userName,
                                    iAm: profile.iAm,
                                    iLike: profile.iLike,
                                    birthdate: formattedDate,
                                    height: profile.height,
                                    weight: profile.weight,
                                    bodyHair: profile.bodyHair,
                                    ethnicity: profile.ethnicity,
                                    overview: profile.overview,
                                    lookingFor: profile.lookingFor,
                                    interests: profile.interests,
                                    positions: profile.positions,
                                    safety: profile.safety,
                                    hometown: profile.hometown
                                  });
        }
    });

  } else {
    res.redirect('../token/login');
  }
});

// =============================================================================
// PUT - update profile record
router.put('/', (req, res) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);

  knex('profiles')
    .where('user_id', userId).first()
    .then((profile) => {
      if(profile) {
        const { iAm, iLike, birthdate, bodyHair, ethnicity,
                overview, lookingFor, interests, positions, methods, hometown } = req.body;

        let height = Number(req.body.height);
        let weight = Number(req.body.weight);

        const updateProfile = {};

        if (iAm) {
          let allIAms = concatSelected(iAm);
          updateProfile.iAm = allIAms;
        }

        if (iLike) {
          let allILikes = concatSelected(iLike);
          updateProfile.iLike = allILikes;
        }

        if (birthdate) updateProfile.birthdate = birthdate;
        if (height) updateProfile.height = height;
        if (weight) updateProfile.weight = weight;
        if (bodyHair) updateProfile.bodyHair = bodyHair;
        if (ethnicity) updateProfile.ethnicity = ethnicity;
        if (overview) updateProfile.overview = overview;
        if (lookingFor) updateProfile.lookingFor = lookingFor;
        if (interests) updateProfile.interests = interests;

        if (positions) {
          let allPositions = concatSelected(positions);
          updateProfile.positions = allPositions;
        }

        if (methods) {
          let allMethods = concatSelected(methods);
          updateProfile.safety = allMethods;
        }

        if (hometown) updateProfile.hometown = hometown;

        return knex('profiles')
          .update(decamelizeKeys(updateProfile), '*')
          .where('user_id', userId);

      } else {
        throw new Error('Profile Not Found');
      }
    })
    .then((row) => {

      const profile = camelizeKeys(row[0]);
      let formattedDate = formateDate(profile.birthdate);

      delete profile.createdAt;
      delete profile.updatedAt;

      res.render('confirm-profile', {iAm: profile.iAm,
                                iLike: profile.iLike,
                                birthdate: formattedDate,
                                height: profile.height,
                                weight: profile.weight,
                                bodyHair: profile.bodyHair,
                                ethnicity: profile.ethnicity,
                                overview: profile.overview,
                                lookingFor: profile.lookingFor,
                                interests: profile.interests,
                                positions: profile.positions,
                                safety: profile.safety,
                                hometown: profile.hometown,
                                status: 'Updated'});
    })
    .catch((err) => {
      console.log('PUT ERROR: ', err);
      res.status(400).send(err);
    });
});

// =============================================================================
// GET - show profile
router.get('/show/:id', (req, res) => {
  let userId = Number(req.params.id);

  knex.select('users.id', 'user_name', 'i_am', 'i_like', 'birthdate', 'height', 'weight',
                'body_hair', 'ethnicity', 'overview', 'looking_for', 'interests',
                'positions', 'safety', 'hometown', 'profile_flag', 'image_path',
                'caption')
    .from('users')
    .join('profiles', 'users.id', 'profiles.user_id')
    .join('photos', 'users.id', 'photos.user_id')
    .where('users.id', userId)
    .where('profile_flag', true)
    .then((row) => {
      const profile = camelizeKeys(row[0]);
      let age = Math.floor((Date.now() - profile.birthdate) / 31556952000);

      if (profile) {
        res.render('show-profile', {
          userId: profile.id,
          userName: profile.userName,
          iAm: profile.iAm,
          iLike: profile.iLike,
          age: age,
          height: profile.height,
          weight: profile.weight,
          bodyHair: profile.bodyHair,
          ethnicity: profile.ethnicity,
          overview: profile.overview,
          lookingFor: profile.lookingFor,
          interests: profile.interests,
          positions: profile.positions,
          safety: profile.safety,
          hometown: profile.hometown,
          imagePath: profile.imagePath,
          caption: profile.caption});
      }

      else console.log("Profile display error.");
    });
});

// =============================================================================
// DELETE profile
router.delete('/', (req, res, next) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);
  let deletedProfile;

  knex.select('*')
    .from('profiles')
    .where('user_id', userId).first()
    .then((profile) => {
      if(profile) {
        deletedProfile = profile;

        return knex('profiles')
          .del().where('user_id', userId);
      } else {
        throw new Error('Profile Not Found');
      }
    })
    .then(() => {

      const profile = camelizeKeys(deletedProfile);
      let formattedDate = formateDate(profile.birthdate);

      delete profile.createdAt;
      delete profile.updatedAt;

      res.render('confirm-profile', {iAm: profile.iAm,
                                iLike: profile.iLike,
                                birthdate: formattedDate,
                                height: profile.height,
                                weight: profile.weight,
                                bodyHair: profile.bodyHair,
                                ethnicity: profile.ethnicity,
                                overview: profile.overview,
                                lookingFor: profile.lookingFor,
                                interests: profile.interests,
                                positions: profile.positions,
                                safety: profile.safety,
                                hometown: profile.hometown,
                                status: 'Deleted'});
    })
    .catch((err) => {
      console.log('DELETE ERROR: ', err);
      res.status(400).send(err);
    });
});

module.exports = router;
