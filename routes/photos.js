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
// show input form to upload photo
router.get('/new', function(req, res) {
  console.log('COOKIE: ', req.cookies);
  if (req.cookies['/token']) {
    res.render('upload');
  } else {
    res.redirect('../token/login');
  }
});

// =============================================================================
// POST new photo
router.post('/', (req, res) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);

  let newPhoto = {
    userId: userId,
    profileFlag: req.body.profileFlag,
    imagePath: req.body.imagePath,
    caption: req.body.caption
  };

  knex('photos')
  .insert(decamelizeKeys(newProfile),
    ['id', 'user_id', 'profile_flag', 'image_path', 'caption'])
    .returning('*')
    .then((row) => {
      const photo = camelizeKeys(row[0]);
      console.log('NEW PHOTO: ', photo);
      res.render('confirm-photo', {profileFlag: photo.profileFlag,
                                    imagePath: photo.imagePath,
                                    caption: photo.caption,
                                    status: 'Added'});
    }).catch(err => {
      console.log('POST ERROR: ', err);
      res.status(400).send(err);
  });
});

// =============================================================================
// show caption update page for current user
router.get('/update', (req, res) => {

  if (req.cookies['/token']) {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('user_id', 'i_am', 'i_like', 'birthdate', 'height', 'weight',
    'body_hair', 'ethnicity', 'overview', 'looking_for', 'interests',
    'positions', 'safety', 'hometown')
    .from('profiles').where('user_id', userId)
    .then((profile) => {
      profile = camelizeKeys(profile[0]);

      if (profile) {
        res.render('edit-profile', {iAm: profile.iAm,
                                  iLike: profile.iLike,
                                  birthdate: profile.numShares,
                                  height: profile.sharePrice,
                                  weight: profile.commission,
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

        console.log('profile from profiles PUT', profile);

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

      delete profile.createdAt;
      delete profile.updatedAt;

      res.render('confirm-profile', {iAm: profile.iAm,
                                iLike: profile.iLike,
                                birthdate: profile.numShares,
                                height: profile.sharePrice,
                                weight: profile.commission,
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
          .del().where('id', profileId);
      } else {
        throw new Error('Profile Not Found');
      }
    })
    .then(() => {

      const profile = camelizeKeys(deletedProfile);

      delete profile.createdAt;
      delete profile.updatedAt;

      res.render('confirm-trade', {iAm: profile.iAm,
                                iLike: profile.iLike,
                                birthdate: profile.numShares,
                                height: profile.sharePrice,
                                weight: profile.commission,
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
