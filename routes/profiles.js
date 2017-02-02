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
// show input form for new profile
router.get('/new', function(req, res) {
  console.log('COOKIE: ', req.cookies);
  if (req.cookies['/token']) {
    res.render('make-profile');
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
    hometown: hometown
  };

  knex('profiles')
  .insert(decamelizeKeys(newProfile),
    ['id', 'user_id', 'i_am', 'i_like', 'birthdate', 'height', 'weight',
    'body_hair', 'ethnicity', 'overview', 'looking_for', 'interests',
    'positions', 'safety', 'hometown'])
    .returning('*')
    .then((row) => {
      const profile = camelizeKeys(row[0]);
      console.log('NEW PROFILE: ', profile);
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
  let passwordUpdated = false;

  knex('profiles')
    .where('id', profileId).first()
    .then((profile) => {
      if(profile) {

        const { firstName, lastName, profileName, email, password1 } = req.body;
        const updateprofile = {};

        if (firstName) updateprofile.firstName = firstName;
        if (lastName) updateprofile.lastName = lastName;
        if (profileName) updateprofile.profileName = profileName;
        if (email) updateprofile.email = profileName;
        if (password1) {
          bcrypt.hash(password1, 12)
            .then((hashed) => {
              updateprofile.hashedPassword = hashed;
              passwordUpdated = true;
            });
        }

        return knex('profiles')
          .update(decamelizeKeys(updateprofile), '*')
          .where('id', profileId);

      } else {
        throw new Error('profile Not Found');
      }
    })
    .then((row) => {

      const profile = camelizeKeys(row[0]);

      delete profile.createdAt;
      delete profile.updatedAt;
      delete profile.hashedPassword;

      res.render('confirm-profile', {firstName: profile.firstName || '',
                                   lastName: profile.lastName || '',
                                   profileName: profile.profileName || '',
                                      email: profile.email || '',
                                   pwStatus: passwordUpdated ? 'Updated' : 'Unchanged',
                                     status: 'Updated'
                                  });
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
  let trxId = Number(req.body.trxId);
  let deletedTrx;

  knex.select('*')
    .from('transactions')
    .join('stocks', 'stocks.id', 'stock_id')
    .where('user_id', userId)
    .where('transactions.id', trxId).first()
    .then((trx) => {
      if(trx) {

        deletedTrx = trx;

        return knex('transactions')
          .del().where('id', trxId);
      } else {
        throw new Error('Transaction Not Found');
      }
    })
    .then(() => {

      const trx = camelizeKeys(deletedTrx);

      delete trx.createdAt;
      delete trx.updatedAt;

      res.render('confirm-trade', {ticker: trx.ticker || '',
                                  company: trx.companyName || '',
                                numShares: trx.numShares || '',
                               sharePrice: trx.sharePrice || '',
                               commission: trx.commission || '',
                                direction: trx.type || '',
                                   action: trx.action || '',
                                   status: 'Deleted'
                                  });
    })
    .catch((err) => {
      console.log('DELETE ERROR: ', err);
      res.status(400).send(err);
    });
});

module.exports = router;
