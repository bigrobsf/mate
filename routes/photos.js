/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

const express = require('express');
const { camelizeKeys, decamelizeKeys } = require('humps');
const uploadcare = require('../node_modules/uploadcare/lib/main.js')('7d2ddbbb700aaaacc7b7', process.env.SECRET_KEY),
fs = require('fs');
var knex = require('../db/knex');
var PhotoInfo = require('../models/photoinfo.js').PhotoInfo;

const router = express.Router();

// =============================================================================
// show input form to upload photo
router.get('/new', (req, res) => {
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    res.render('upload', {
      userId: userId
    });
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
    imagePath: req.body.imagePath,
    caption: 'Add a caption!'
  };

  console.log('new photo to save: ', newPhoto);

  // if user doesn't have any photos, set the first photo uploaded as profile photo
  knex.select('user_id').from('photos').where('user_id', userId)
    .then((pic) => {

      if (pic.length > 0) {
        newPhoto.profileFlag = false;
        console.log('s/b false', newPhoto.profileFlag);
      } else {
        newPhoto.profileFlag = true;
        console.log('s/b true', newPhoto.profileFlag);
      }

      knex('photos')
      .insert(decamelizeKeys(newPhoto),
      ['user_id', 'image_path', 'profile_flag', 'caption'])
      .returning('*')
      .then((row) => {

        const photo = camelizeKeys(row[0]);
        console.log('NEW PHOTO: ', photo);

        // this never runs for some reason - it's on the bug list
        // res.render('confirm-photo', {
        //   userId: userId,
        //   profileFlag: false,
        //   imagePath: photo.imagePath,
        //   caption: photo.caption,
        //   status: 'Saved'});
        }).catch(err => {
          console.log('POST ERROR: ', err);
          res.status(400).send(err);
        });
    });
});

// =============================================================================
// show photo update page for current user and selected photo
router.get('/update/:id', (req, res) => {
  let photoId = Number(req.params.id);

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('id', 'user_id', 'profile_flag', 'image_path', 'caption')
      .from('photos')
      .where('photos.user_id', userId)
      .where('photos.id', photoId)
      .then((pic) => {
        let photo = camelizeKeys(pic[0]);

        if (photo) {
          res.render('edit-photo', {
            userId: photo.userId,
            photoId: photo.id,
            imagePath: photo.imagePath,
            caption: photo.caption,
            profileFlag: photo.profileFlag,
            status: 'Updated'
          });
        } else {
          console.log('You can only update your own photos.');
          res.redirect('/photos/showone/' + photoId);
        }
      });
  }
});

// =============================================================================
// PUT - update photo record
router.put('/', (req, res) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);
  let photoId = Number(req.body.photoId);

  knex('photos')
    .where('user_id', userId)
    .where('id', photoId).first()
    .then((pic) => {
      console.log('pic to update: ', pic);
      if(pic) {
        let profileFlag = req.body.profileFlag || false;
        let caption = req.body.caption;

        const updatePhoto = {};

        // if new photo is selected as profile, set existing photo's flag to false
        if (profileFlag === 'on') {
          knex('photos')
            .where ('user_id', userId)
            .where('profile_flag', true)
            .update({profile_flag: false})
            .then(() => {
              console.log('previous flag has been set to false');
            });
            updatePhoto.profileFlag = true;
        }

        if (caption) updatePhoto.caption = caption;

        return knex('photos')
          .update(decamelizeKeys(updatePhoto), '*')
          .where('id', photoId);

      } else {
        console.log('Photo Not Found');
      }
    })
    .then((row) => {

      const photo = camelizeKeys(row[0]);

      res.render('confirm-photo', {
        userId: userId,
        imagePath: photo.imagePath,
        caption: photo.caption,
        status: 'Updated'});
    })
    .catch((err) => {
      console.log('PUT ERROR: ', err);
      res.status(400).send(err);
    });
});

// =============================================================================
// GET - show photos for selected user
router.get('/show/:id', (req, res) => {
  let userId = Number(req.params.id);

  knex.select('user_name', 'photos.id', 'image_path', 'caption')
    .from('users')
    .join('photos', 'users.id', 'photos.user_id')
    .where('users.id', userId)
    .then((pics) => {
      if (pics.length > 0) {
        let photos = camelizeKeys(pics);
        let userName = photos[0].userName;
        let photoArray = [];

        photos.forEach((ele, i) => {
          var photo = new PhotoInfo(photos[i].id, photos[i].imagePath,
            photos[i].caption);

          photoArray.push(photo);
        });

        res.render('show-photos', {
          userId: userId,
          userName: userName || 'error: photo not saved to database',
          photoArray: photoArray || []
        });

        } else {
          console.log('New photo not saved to database. User ID: ', userId);

          res.render('show-photos', {
            userId: userId,
            userName: 'error: photo not saved to database',
            photoArray: []
          });
        }
    });
});

// =============================================================================
// GET - show one photo
router.get('/showone/:id', (req, res) => {
  let photoId = Number(req.params.id);
  let activeUser = 0;

  if (req.cookies['/token']) {
    activeUser = Number(req.cookies['/token'].split('.')[0]);
  }

  console.log('activeUser', activeUser);

  knex.select('user_name', 'users.id', 'image_path', 'caption')
    .from('users')
    .join('photos', 'users.id', 'photos.user_id')
    .where('photos.id', photoId)
    .then((pic) => {
      let photo = camelizeKeys(pic[0]);
      console.log('photoinfo', photo);

      res.render('show-photo', {
        msg : '',
        userName: photo.userName,
        userId: photo.id,
        activeUser: activeUser,
        photoId: photoId,
        imagePath: photo.imagePath,
        caption: photo.caption});
    });
});

// =============================================================================
// DELETE photo
router.delete('/:id', (req, res, next) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);
  let photoId = Number(req.params.id);
  let deletedPhoto;

  knex.select('user_name', 'caption', 'profile_flag', 'image_path')
    .from('photos')
    .join('users', 'photos.user_id', 'users.id')
    .where('user_id', userId)
    .where('photos.id', photoId)
    .then((pic) => {
      console.log('pic to delete: ', pic);
      let photo = camelizeKeys(pic[0]);
      console.log('pic to delete: ', photo.profileFlag);
      if (photo.profileFlag === false) {
        console.log('image path', photo.imagePath.split('/'));

        return knex('photos')
          .del().where('id', photoId)
          .then((deleted) => {
            console.log('delete result', deleted);
            if (deleted) {
              // uploadcare.files.remove(photo.imagePath, (err, data) => {
              //   console.log('error: ', err);
              //   console.log('data: ', data);
              // });
            }

            res.render('confirm-photo', {
              userId: userId,
              caption: photo.caption,
              imagePath: '/images/deleted.jpg',
              status: 'Deleted'});
            });

      } else {
        let errorMsg = 'You cannot delete your profile photo.';
        res.render('show-photo', {
          msg: errorMsg,
          userName: photo.userName,
          imagePath: photo.imagePath,
          photoId: photoId,
          caption: photo.caption,
          activeUser: userId,
          userId: userId
        });
      }
    });
});

module.exports = router;
