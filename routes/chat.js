/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
'use strict';

const boom  = require('boom');
const express = require('express');
const moment = require('moment');
const { camelizeKeys, decamelizeKeys } = require('humps');
var knex = require('../db/knex');

const router = express.Router();

// =============================================================================
// GET last message
router.get('/message', (req, res) => {

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let curUserId = Number(req.cookies['/token'].split('.')[0]);

    knex.raw(`select users1.user_name as username1,
      users2.user_name as username2,
      users1.id as userid1,users2.id as userid2,
      message, messages.created_at
      from users users1, users users2, messages
      where users1.id = messages.user_id1
      and users2.id = messages.user_id2
      and users2.id = ${curUserId}
      order by messages.created_at desc
      fetch first 1 rows only;`)
      .then((message) => {

        if (message.length > 0) {
          message = message.rows[0];
          console.log('MESSAGE TEST', message);
          res.status(200).json(message);
        } else {
          res.status(200).json(false);
        }
      });
  } else {
    res.status(200).json(false);
  }


});

// =============================================================================
// POST single message
router.post('/message', (req, res) => {
  // console.log('req.body from chat route: ', req.body);
  let conversation = {
    user_id1: req.body.user_id1,
    user_id2: req.body.user_id2,
    message: req.body.message
  };

  console.log('conversation received from client chat.js: ', conversation);

  knex('messages')
  .insert(decamelizeKeys(conversation),
    ['user_id1', 'user_id2', 'message'])
  .returning('*')
  .then((row) => {

    let test = camelizeKeys(row[0]);
    console.log('from chat.js: ',test);

    knex('users').where('id', conversation.user_id2).update({message: true})
      .then((result) => {
        console.log('message flag updated', result);
    });
  })
  .catch((err) => {
    console.log('POST ERROR: ', err);
  });
});

// =============================================================================
// show chat with single user
router.get('/private/:id', (req, res) => {
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

        knex.select('user_name')
          .from('users')
          .where('id', curUserId)
          .then((curUser) => {
            let current = camelizeKeys(curUser[0]);

            // console.log('curUserName: ', current.userName);

            res.render('user-chat', {
              userName: targetUser.userName,
              imagePath: targetUser.imagePath,
              targetUserId: targetUserId,
              curUserId: curUserId,
              curUserName: current.userName
            });
        });
      });
  } else {
    res.redirect('../token/login');
  }
});


// =============================================================================
// show message history
router.get('/history', (req, res) => {
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let curUserId = Number(req.cookies['/token'].split('.')[0]);

    knex.raw(`select users1.user_name as username1,
      users2.user_name as username2, users1.id as userid1,
      users2.id as userid2, messages.message, messages.created_at, image_path
      from users users1, users users2, messages, photos
      where users1.id = messages.user_id1 and users2.id = messages.user_id2
      and users1.id = photos.user_id
      and (users2.id = ${curUserId} or users1.id = ${curUserId})
      and photos.profile_flag = true order by messages.created_at desc;`)
      .then((messages) => {
      messages = messages.rows;
      // console.log('knex.raw: ', messages);
      // console.log('CURUSERID: ', curUserId);
      messages.forEach((ele, i) => {
        var date = new Date(ele.created_at - 28800000); // subtract 8 hours from UTC
        ele.created_at = moment(date).format('MMMM Do YYYY, h:mm:ss a');
      });
      res.render('conversations', {
        messages: messages,
        curUserId: curUserId
      });
    });

  } else res.redirect('/token/login');
});

// =============================================================================
// show chatroom page
router.get('/open', (req, res) => {
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let curUserId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('user_name')
      .from('users')
      .where('id', curUserId)
      .then((curUser) => {
        let current = camelizeKeys(curUser[0]);

        res.render('chatroom', {
          curUserId: curUserId,
          curUserName: current.userName
        });
    });
  } else res.redirect('/token/login');
});


module.exports = router;
