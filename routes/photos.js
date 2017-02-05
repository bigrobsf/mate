/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
var knex = require('../db/knex');
var PhotoInfo = require('../models/photoinfo.js').PhotoInfo;

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


// =============================================================================
// GET - show photos
router.get('/show/:id', (req, res) => {
  let userId = Number(req.params.id);

  knex.select('user_name', 'image_path', 'caption')
    .from('users')
    .join('photos', 'users.id', 'photos.user_id')
    .where('users.id', userId)
    .then((pics) => {
      let photos = camelizeKeys(pics);
      console.log('photoinfo', photos);
      let userName = photos[0].userName;
      let photoArray = [];

      photos.forEach((ele, i) => {
        var photo = new PhotoInfo(photos[i].imagePath,
          photos[i].caption);

        photoArray.push(photo);
      });

      res.render('show-photos', {userName: userName,
                                photoArray: photoArray});
    });
});

module.exports = router;
