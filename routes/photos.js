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
router.get('/new', (req, res) => {
  console.log('COOKIE: ', req.cookies);
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
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
        console.log('update photo for other user returns: ', photo);
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
        let profileFlag = req.body.profileFlag;
        let caption = req.body.caption;

        const updatePhoto = {};

        console.log('new profileflag before', profileFlag);

        if (profileFlag === 'on') {
          knex('photos')
            .where ('user_id', userId)
            .where('profile_flag', true)
            .update({profile_flag: false})
            .then(() => {
              console.log('previous flag has been set to false');
            });
            updatePhoto.profileFlag = true;
            console.log('new profileflag after', updatePhoto.profileFlag);
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
        userName: userName,
        photoArray: photoArray});
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

        return knex('photos')
          .del().where('id', photoId)
          .then(() => {

            res.render('confirm-photo', {
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
