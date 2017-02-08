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

const router = express.Router();

// =============================================================================
// show chat with single user
router.get('/:id', (req, res) => {
  let targetUserId = Number(req.params.id);

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let curUserId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('user_name', 'photos.id', 'image_path')
      .from('users')
      .join('photos', 'users.id', 'photos.user_id')
      .where('users.id', targetUserId)
      .where('profile_flag', true)
      .then((target) => {
        let targetUser = camelizeKeys(target[0]);

        res.render('user-chat', {
          userName: targetUser.userName,
          imagePath: targetUser.imagePath,
          targetUserId: targetUserId,
          curUserId: curUserId
        });
      });
  } else {
    res.redirect('../token/login');
  }
});


// =============================================================================
// show all chats
router.get('/', (req, res) => {
  res.redirect('/');
});


module.exports = router;
